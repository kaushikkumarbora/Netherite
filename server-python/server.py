# TODO Create flask app
from flask import Flask, send_from_directory, escape

app = Flask(__name__, static_folder='../client/build/static')

@app.route("/assets", methods=['GET'])
def getAssets():
    return "TODO - Query + Send all assets"

@app.route("/assets/<asset_id>", methods=['GET'])
def getAsset(asset_id):
    return "TODO - Query + Send one asset"

@app.route("/", methods=['GET'])
def index():
    return send_from_directory('../client/build', 'index.html')

@app.route("/<file>", methods=['GET'])
def index_file(file):
    return send_from_directory('../client/build', escape(file))

if __name__ == '__main__':
    app.run(debug=True)