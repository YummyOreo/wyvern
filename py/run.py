import os, webbrowser
from os import system

os.system("npm i")
os.system("tsc")
webbrowser.open('http://localhost:3000/', autoraise=True)
os.system("npm run devStart")