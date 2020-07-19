from flask import Flask, request
import json
import psycopg2
import logging

# Conexão com a base de dados local, utilizando o psycopg2
con = psycopg2.connect(
    dbname="workshare",
    user="postgres",
    host="localhost",
    password="foobar",
    port="5432",
)

cur = con.cursor()

app = Flask(__name__)

# Rota de criação do usuário
@app.route("/user", methods=["POST"])
def user():
    # Os dados para a inserção vêm em um metódo POST, num objeto JSON
    data = json.loads(request.data)

    try:
        # Execução do comando de inserção, utilizando os dados provenientes da requisição
        cur.execute(
            """
            INSERT INTO usuario (nome, username, email, senha)
            VALUES (%s, %s, %s, %s)
            """,
            (
                data.get("fullName") if data.get("fullName") != "" else None,
                data.get("username") if data.get("username") != "" else None,
                data.get("email") if data.get("email") != "" else None,
                data.get("password") if data.get("password") != "" else None,
            ),
        )

        # Commit na base de dados, para salvar os dados
        con.commit()
    except psycopg2.IntegrityError as e:
        con.rollback()
        # Tratamento de erro para caso algum campo seja NULL
        if e.pgcode == "23502":
            return (
                {"error": "Alguns dos campos obrigatórios estão vazios"},
                422,
            )
        # Tratamento de erro para caso algum campo não seja unique
        if e.pgcode == "23505":
            return (
                {"error": "Já existe um usuário com esse username e/ou e-mail"},
                422,
            )
    except Exception as e:
        con.rollback()
        # Caso algum erro além dos que foram apresentados anteriormente, temos um método "catch-all"
        # para avisar o usuário que algum erro ocorreu
        return (
            {
                "error": "Um erro inesperado ocorreu ao criar seu usuário.\nDetalhes: "
                + str(e)
            },
            500,
        )

    # Caso tudo ocorra sem problemas, o usuário recebe a mensagem
    return (
        {"message": "Usuário {} criado com sucesso!".format(data.get("username"))},
        201,
    )


# Rota para a busca de um usuário
@app.route("/user/<query>", methods=["GET"])
def user_search(query):
    # "query" é enviado na url como a busca que será feita, uma vez que métodos GET não tem um corpo
    # na mensagem. Portanto, se queremos buscar um usuário de username "foobar", a url seria
    # user/foobar
    try:
        # Comando de execução da busca, com JOINs necessários para pegar os dados de locatário e
        # propriétario, de um usuário (caso os tenha)
        cur.execute(
            """
            SELECT u.username, l.username, p.username, u.nome, u.email, l.cpf, l.rg, l.cnpj, p.cpf, p.rg
            FROM usuario u LEFT JOIN locatario l ON u.username = l.username LEFT JOIN proprietario
            p ON u.username = p.username WHERE LOWER(u.username)='{}' OR LOWER(u.email)='{}'
            """.format(
                query, query
            )
        )
        user = cur.fetchone()
    except Exception as e:
        # Tratamento de erros gerais
        return (
            {
                "error": "Um erro inesperado ocorreu ao fazer a sua busca.\nDetalhes: "
                + str(e)
            },
            500,
        )

    if user is None:
        # Caso o usuário não tenha sido encontrado, enviamos uma mensagem de erro
        return (
            {"error": "Não foi encontrado nenhum usuário com esse nome ou e-mail"},
            404,
        )

    # Caso o usuário exista, montamos um objeto de resposta, com as informações obtidas na busca
    response = {
        "username": user[0],
        "name": user[3],
        "email": user[4],
        "isLoc": user[1] is not None,
        "isProp": user[2] is not None,
        "lCpf": user[5],
        "lRg": user[6],
        "lCnpj": user[7],
        "pCpf": user[8],
        "pRg": user[9],
    }

    # Envio da resposta, com código de status 200 (Sucesso)
    return (response, 200)


# Rota da página inicial
@app.route("/")
def index():
    return "<h1>WorkShare API</h1>"


if __name__ == "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
    app.run(threaded=True, port=5000)
