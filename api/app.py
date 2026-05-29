import json
from flask import Flask, jsonify
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@app.route("/arrets")
def get_arrets():
    ensemble_arrets = set()
    
    # On parcourt chaque ligne de bus
    for ligne in lignes:
        # On parcourt chaque arrêt de la ligne actuelle
        for arret in ligne["listeArrets"]:
            ensemble_arrets.add(arret)
            
    # On convertit le set en liste pour pouvoir le renvoyer en JSON
    return jsonify(list(ensemble_arrets))

@app.route("/stats")
def get_stats():
    # 1. Nombre total de lignes
    total_lignes = len(lignes)
    
    # 2. Nombre total d'arrêts (somme du champ 'arrets' de toutes les lignes)
    total_arrets = sum(ligne["arrets"] for ligne in lignes)
    
    # 3. Numéro de la ligne ayant le plus d'arrêts
    # On cherche la ligne avec le maximum d'arrêts, puis on extrait son "numero"
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    numero_ligne_max = ligne_max["numero"]
    
    # On renvoie le tout sous forme de dictionnaire JSON
    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets,
        "ligne_plus_d_arrets": numero_ligne_max
    })

@app.route("/lignes/recherche")
def recherche_lignes():
    # On récupère le paramètre "q" dans l'URL (ex: ?q=Pikine). 
    # Si "q" n'est pas fourni, on utilise une chaîne vide "" par défaut.
    query = request.args.get("q", "")
    
    # On filtre les lignes : le départ OU l'arrivée doit contenir le mot recherché
    # On utilise .lower() pour que la recherche ne soit pas sensible à la casse (majuscules/minuscules)
    lignes_filtrees = [
        ligne for ligne in lignes 
        if query.lower() in ligne["depart"].lower() or query.lower() in ligne["arrivee"].lower()
    ]
    
    return jsonify(lignes_filtrees)

if __name__ == "__main__":
    app.run(debug=True, port=5000)