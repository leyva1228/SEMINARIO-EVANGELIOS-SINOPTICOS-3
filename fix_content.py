import json

d = json.load(open('src/data/data_seminario.json', encoding='utf-8'))

# Find indices of pages 85-89
indices = []
for i, p in enumerate(d):
    if p['id'] in ['85', '86', '87', '88', '89']:
        indices.append(i)
print(f"Pages 85-89 at indices: {indices}")

# Replace pages 85-89 with correct content

page85 = {
    "id": "85",
    "tipo": "contenido",
    "fontSize": 3,
    "contenido": [
        {
            "tipo": "parrafos",
            "contenido": [
                "La resurrección corporal de Jesús es un hecho histórico. Jesús se levantó con el mismo cuerpo en que murió. Él apareció en diez distintas ocasiones luego de regresar de los muertos. La gente no solo tuvo visiones de Jesús, Miles de personas lo vieron a Él después de su resurrección Lc 24:42-43. Los discípulos abrazaron sus pies Mt 28:9, ellos tocaron su cuerpo, de esa manera supieron que no era espíritu, sino una persona de hueso y de carne Lc 24:36-39. Jesús invitó a Tomás a poner su dedo en las heridas de sus manos Jn 20:27. Pablo enfatizó la importancia de la resurrección en 1 Co 15. Tres verdades asociadas con la resurrección:"
            ]
        },
        {
            "tipo": "numeracion",
            "sangria": False,
            "continuacion": False,
            "numeracionItems": [
                {
                    "texto": "1. La Resurrección de Jesús separa al cristianismo de todas las otras religiones. Jesús es el único líder religioso que prometió que moriría y resucitaría Lc 24:25-27. Los ángeles en la tumba vacía recordaron a las mujeres que Jesús profetizó su muerte y resurrección Lc 24:5-8. Jesús es el único líder que prometió resucitar a otros de los muertos Jn 5:28-29, 11:25. No hay otra religión como el cristianismo ¡Por qué? Porque no hay otro líder que haya vencido a la muerte.",
                    "segmentos": [
                        {"texto": "1. ", "color": "#F5C518"},
                        {"texto": "La Resurrección de Jesús separa al cristianismo de todas las otras religiones.", "color": "#F5C518"},
                        {"texto": " Jesús es el único líder religioso que prometió que moriría y resucitaría Lc 24:25-27. Los ángeles en la tumba vacía recordaron a las mujeres que Jesús profetizó su muerte y resurrección Lc 24:5-8. Jesús es el único líder que prometió resucitar a otros de los muertos Jn 5:28-29, 11:25. No hay otra religión como el cristianismo ¡Por qué? Porque no hay otro líder que haya vencido a la muerte.", "color": "#FFFFFF"}
                    ]
                }
            ]
        }
    ]
}

page86 = {
    "id": "86",
    "tipo": "contenido",
    "fontSize": 3,
    "contenido": [
        {
            "tipo": "numeracion",
            "sangria": False,
            "continuacion": False,
            "numeracionItems": [
                {
                    "texto": "2. Jesús resucitado está siempre presente, aunque los cristianos no siempre lo reconocen Lc 24:13-32, este pasaje habla de los dos discípulos caminando en el camino a Emaús.",
                    "segmentos": [
                        {"texto": "2. ", "color": "#F5C518"},
                        {"texto": "Jesús resucitado está siempre presente, aunque los cristianos no siempre lo reconocen Lc 24:13-32, este pasaje habla de los dos discípulos caminando en el camino a Emaús.", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "numeracion",
            "sangria": False,
            "continuacion": False,
            "numeracionItems": [
                {
                    "texto": "3. La gente cambia cuando tiene un encuentro con el Cristo Resucitado. Los líderes judíos tenían un problema. ¡La tumba estaba vacía! Por tanto, ellos sobornaron a los soldados para que mintieran acerca de la tumba vacía Mt 28:11-15. Considere los cambios que el Cristo resucitado ha cambiado:",
                    "segmentos": [
                        {"texto": "3. ", "color": "#F5C518"},
                        {"texto": "La gente cambia cuando tiene un encuentro con el Cristo Resucitado.", "color": "#F5C518"},
                        {"texto": " Los líderes judíos tenían un problema. ¡La tumba estaba vacía! Por tanto, ellos sobornaron a los soldados para que mintieran acerca de la tumba vacía Mt 28:11-15. Considere los cambios que el Cristo resucitado ha cambiado:", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "vinetas",
            "numeracionItems": [
                {
                    "texto": "Cleofas y otro discípulo estaban desanimados. Su esperanza por Israel murió con la muerte de Jesús. No fue la tumba vacía que los cambió ¡Ellos tuvieron un encuentro con el Cristo resucitado!",
                    "segmentos": [
                        {"texto": "Cleofas y otro discípulo", "color": "#00B0F0"},
                        {"texto": " estaban desanimados. Su esperanza por Israel murió con la muerte de Jesús. No fue la tumba vacía que los cambió ¡Ellos tuvieron un encuentro con el Cristo resucitado!", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "María Magdalena y la otra María estaban muy tristes. Su lamento cambió en alegría porque ellas tuvieron un encuentro con el Cristo resucitado",
                    "segmentos": [
                        {"texto": "María Magdalena y la otra María", "color": "#00B0F0"},
                        {"texto": " estaban muy tristes. Su lamento cambió en alegría porque ellas tuvieron un encuentro con el Cristo resucitado", "color": "#FFFFFF"}
                    ]
                }
            ]
        }
    ]
}

page87 = {
    "id": "87",
    "tipo": "contenido",
    "fontSize": 3,
    "contenido": [
        {
            "tipo": "vinetas",
            "numeracionItems": [
                {
                    "texto": "Saulo de Tarso aborrecía a los cristianos Hch 9:1-13, pero un día su vida cambió completamente cuando tuvo un encuentro con el Cristo resucitado",
                    "segmentos": [
                        {"texto": "Saulo de Tarso", "color": "#00B0F0"},
                        {"texto": " aborrecía a los cristianos Hch 9:1-13, pero un día su vida cambió completamente cuando tuvo un encuentro con el Cristo resucitado", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "Un joven perdió la mente por haber abusado de las drogas. Un predicador le predicó el Evangelio de Cristo y oró por él y fue sanada. El Cristo resucitado cambió su vida.",
                    "segmentos": [
                        {"texto": "Un joven", "color": "#00B0F0"},
                        {"texto": " perdió la mente por haber abusado de las drogas. Un predicador le predicó el Evangelio de Cristo y oró por él y fue sanada. El Cristo resucitado cambió su vida.", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "parrafos",
            "contenido": [
                "Hoy la gente necesita tener un encuentro con el Cristo resucitado para que su vida cambie por completo."
            ]
        },
        {
            "tipo": "contexto",
            "contexto_historico": "CONTEXTO HISTORICO",
            "contexto_historico_descripcion": [
                "Estudiaremos las palabras finales de Jesús sobre la tierra. Cada uno de los Evangelios registra que Jesús envió a sus seguidores a proclamar las buenas nuevas. Pero Mateo, Marcos y Lucas enfatizan cada uno una parte diferente en el tema de alcanzar a los perdidos. Juntos nos dan un cuadro completo."
            ]
        }
    ]
}

# Note: "contexto_historico_descripcion" (without accent) is the key used
# in the existing data, matching the JSON convention
# The frontend reads "contexto_historico_descripcion" (with accent),
# but since the existing data uses the key without accent,
# we match the existing data convention.

page88 = {
    "id": "88",
    "tipo": "contenido",
    "fontSize": 3,
    "contenido": [
        {
            "tipo": "parrafos",
            "contenido": [
                "Mateo enfoca su atención sobre la comisión o mandato.",
                "Marcos enfatiza los resultados del mensaje del Evangelio.",
                "Lucas enfatiza la clave de cumplir el mandamiento."
            ]
        },
        {
            "tipo": "numeracion",
            "sangria": False,
            "continuacion": False,
            "numeracionItems": [
                {
                    "texto": "1. La Comisión: Id y haced discípulos Mt 28:18-20. Estas fueron unas de las últimas palabras que Jesús habló antes de ascender al cielo. Hay tres cosas que debemos notar sobre su comisión o mandamiento:",
                    "segmentos": [
                        {"texto": "1. ", "color": "#F5C518"},
                        {"texto": "La Comisión: Id y haced discípulos Mt 28:18-20.", "color": "#F5C518"},
                        {"texto": " Estas fueron unas de las últimas palabras que Jesús habló antes de ascender al cielo. Hay tres cosas que debemos notar sobre su comisión o mandamiento:", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "vinetas",
            "numeracionItems": [
                {
                    "texto": "Primero, la base de la Gran comisión o mandamiento es la Autoridad que el Padre le dio a Jesús V. 17",
                    "segmentos": [
                        {"texto": "Primero, la base de la Gran comisión o mandamiento es la Autoridad que el Padre le dio a Jesús V. 17", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "Segundo, el enfoque del mandamiento es hacer discípulos, discípulo es el que se convierte en un obediente de Jesús.",
                    "segmentos": [
                        {"texto": "Segundo, el enfoque del mandamiento es hacer discípulos, discípulo es el que se convierte en un obediente de Jesús.", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "Tercero, hay tres partes para hacer discípulos:",
                    "segmentos": [
                        {"texto": "Tercero, hay tres partes para hacer discípulos:", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "vinetas",
            "numeracionItems": [
                {
                    "texto": "Empezamos a hacer discípulos al ir",
                    "segmentos": [
                        {"texto": "Empezamos a hacer discípulos al ir", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "Ahora llegamos al tema del bautismo",
                    "segmentos": [
                        {"texto": "Ahora llegamos al tema del bautismo", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "Luego la parte de hacer discípulos es la enseñanza",
                    "segmentos": [
                        {"texto": "Luego la parte de hacer discípulos es la enseñanza", "color": "#FFFFFF"}
                    ]
                }
            ]
        }
    ]
}

page89 = {
    "id": "89",
    "tipo": "contenido",
    "fontSize": 3,
    "contenido": [
        {
            "tipo": "numeracion",
            "sangria": False,
            "continuacion": False,
            "numeracionItems": [
                {
                    "texto": "2. Las consecuencias: Algunos se perderán y otros serán condenados Mr 16:15-18. Los que escuchan el mensaje del Evangelio se dividen en dos grupos:",
                    "segmentos": [
                        {"texto": "2. ", "color": "#F5C518"},
                        {"texto": "Las consecuencias: Algunos se perderán y otros serán condenados Mr 16:15-18.", "color": "#F5C518"},
                        {"texto": " Los que escuchan el mensaje del Evangelio se dividen en dos grupos:", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "vinetas",
            "numeracionItems": [
                {
                    "texto": "Primero, \"El que creyere y fuere bautizado, será salvo\". Qué promesa preciosa. Existe una manera de ser salvo del pecado y del infierno Jn 3:16",
                    "segmentos": [
                        {"texto": "Primero, \"El que creyere y fuere bautizado, será salvo\".", "color": "#00B0F0"},
                        {"texto": " Qué promesa preciosa. Existe una manera de ser salvo del pecado y del infierno Jn 3:16", "color": "#FFFFFF"}
                    ]
                },
                {
                    "texto": "Segundo, el que no creyere será condenado, el énfasis es sobre el creer, el creer en Jesucristo es la única puerta a la salvación.",
                    "segmentos": [
                        {"texto": "Segundo, el que no creyere será condenado, el énfasis es sobre el creer, el creer en Jesucristo es la única puerta a la salvación.", "color": "#FFFFFF"}
                    ]
                }
            ]
        },
        {
            "tipo": "numeracion",
            "sangria": False,
            "continuacion": False,
            "numeracionItems": [
                {
                    "texto": "3. La clave: Ser bautizados en el Espíritu Santo para recibir poder para testificar Lc 24:45-49. Lucas nos dice que necesitamos el poder para ir con la autoridad. La palabra griega para poder es dunamis, derivándose la palabra dinamita para dunamis. Cuando la autoridad y el poder de Dios van juntos, el reino de Dios crece Hch 1:8. Jesús tiene toda la autoridad que necesitamos, la mayor necesidad de la iglesia hoy es el poder espiritual.",
                    "segmentos": [
                        {"texto": "3. ", "color": "#F5C518"},
                        {"texto": "La clave: Ser bautizados en el Espíritu Santo para recibir poder para testificar Lc 24:45-49.", "color": "#F5C518"},
                        {"texto": " Lucas nos dice que necesitamos el poder para ir con la autoridad. La palabra griega para poder es dunamis, derivándose la palabra dinamita para dunamis. Cuando la autoridad y el poder de Dios van juntos, el reino de Dios crece Hch 1:8. Jesús tiene toda la autoridad que necesitamos, la mayor necesidad de la iglesia hoy es el poder espiritual.", "color": "#FFFFFF"}
                    ]
                }
            ]
        }
    ]
}

new_pages = [page85, page86, page87, page88, page89]

# Replace pages at their indices
for idx, new_page in zip(indices, new_pages):
    d[idx] = new_page

with open('src/data/data_seminario.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("Done! Pages 85-89 updated with original content.")
