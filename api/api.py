from flask import Flask
from flask import request
import json
import psycopg2

con = psycopg2.connect("dbname='pet_shop' user='Dezan' host='localhost' password=''")
cur = con.cursor()

app = Flask(__name__)


@app.route("/user", methods=["GET", "POST"])
def user():
    if request.method == "POST":
        return "aeae"
    else:
        cur.execute("SELECT * FROM users")
        users = cur.fetchall()
        return json.dumps(users, default=str)
