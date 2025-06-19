import subprocess

# Comandos que quieres ejecutar
commands = [
    ["nodemon", "index.js"],
    ["nodemon", "credit-card-backend/cardServer.js"]
]

processes = []

for cmd in commands:
    # Lanzar cada proceso en segundo plano
    p = subprocess.Popen(cmd)
    processes.append(p)

# Esperar a que terminen ambos procesos (normalmente nodemon corre siempre)
for p in processes:
    p.wait()
