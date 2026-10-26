# Spec Delta

## Purpose

Juntar, deduplicar y ordenar candidatos de fuentes públicas para que los
cohosts de Noches de Alquimia tengan cada semana una lista corta de temas
posibles, y guardar cada corrida para consultarla después.

## ADDED Requirements

### Requirement: Solo los admins disparan y ven la curación
El sistema SHALL permitir lanzar una corrida de curación y ver sus resultados
solo a usuarios con rol admin. Si quien entra no inició sesión, se le pide que
inicie sesión. Si inició sesión y no es admin, la página no existe para él.

#### Scenario: Admin entra a la página
- **WHEN** un admin abre `/admin/podcast`
- **THEN** ve el botón Curar y los resultados de la última corrida

#### Scenario: Usuario sin rol admin
- **WHEN** un usuario que inició sesión y no es admin abre `/admin/podcast`
- **THEN** recibe un 404

#### Scenario: Visitante sin sesión
- **WHEN** alguien sin sesión abre `/admin/podcast`
- **THEN** se le pide que inicie sesión

#### Scenario: Disparo sin permisos
- **WHEN** un usuario que no es admin invoca la acción de curar
- **THEN** la acción falla con error de permisos y no se crea ninguna corrida

### Requirement: La corrida se dispara a mano
El sistema SHALL lanzar una corrida de curación solo cuando un admin aprieta
Curar en el panel o cuando alguien corre el comando de CLI. No existe ninguna
ejecución programada.

#### Scenario: Admin aprieta Curar
- **WHEN** un admin aprieta Curar
- **THEN** se ejecuta una corrida y, al terminar, la página muestra sus resultados

#### Scenario: Botón mientras corre
- **WHEN** hay una corrida en curso lanzada desde la página
- **THEN** el botón queda deshabilitado hasta que termina

### Requirement: Ventana de la corrida
Cada corrida SHALL considerar solo los ítems publicados (o, en GitHub,
marcados con star) entre el fin de la ventana de la última corrida completada
y el momento en que empieza. Si no hay corridas completadas, la ventana
arranca la cantidad de días configurada antes del inicio.

#### Scenario: Primera corrida
- **WHEN** no hay ninguna corrida completada y la ventana por defecto es de 7 días
- **THEN** la corrida considera los ítems de los últimos 7 días

#### Scenario: Corrida siguiente
- **WHEN** la última corrida completada terminó su ventana el lunes a las 10:00
- **THEN** la nueva corrida considera los ítems desde el lunes a las 10:00 hasta ahora

#### Scenario: Ítem fuera de la ventana
- **WHEN** una fuente devuelve un ítem publicado antes del inicio de la ventana
- **THEN** ese ítem no se vuelve candidato

#### Scenario: Fuente que solo informa el día
- **WHEN** una fuente da solo la fecha de publicación, sin hora (bioRxiv)
- **THEN** la ventana se compara por día, así que entran los ítems publicados el mismo día en que empieza la ventana

### Requirement: Fuentes de candidatos
El sistema SHALL juntar candidatos de las fuentes habilitadas en la
configuración: Hacker News, las stars de una cuenta de GitHub, arXiv por
categorías, bioRxiv por categorías y feeds RSS. Cada candidato tiene título,
URL, fuente y fecha, y una señal numérica cuando la fuente la tiene.

#### Scenario: Hacker News
- **WHEN** corre la fuente de Hacker News
- **THEN** sus candidatos son historias con al menos los puntos mínimos configurados, con los puntos como señal

#### Scenario: Stars de GitHub
- **WHEN** corre la fuente de GitHub con la cuenta configurada
- **THEN** sus candidatos son los repos que esa cuenta marcó con star dentro de la ventana

#### Scenario: Fuente deshabilitada
- **WHEN** una fuente está deshabilitada en la configuración
- **THEN** no se consulta y no aporta candidatos

### Requirement: Deduplicación por URL
El sistema SHALL normalizar la URL de cada candidato y quedarse con uno solo
por URL normalizada dentro de una corrida. Si dos fuentes traen la misma URL,
queda el candidato de la fuente con mayor prioridad en la configuración.

#### Scenario: Misma URL con variaciones
- **WHEN** dos ítems apuntan a la misma página y difieren solo en `www`, la barra final, el fragmento o parámetros `utm_*`
- **THEN** la corrida guarda un solo candidato

#### Scenario: Misma URL en dos fuentes
- **WHEN** una historia de Hacker News enlaza a un repo que también aparece en las stars de GitHub, y Hacker News tiene mayor prioridad
- **THEN** queda el candidato de Hacker News

### Requirement: No se repiten candidatos del top
El sistema SHALL excluir de una corrida cualquier candidato cuya URL
normalizada ya estuvo en el top de una corrida anterior. Los candidatos que
no llegaron al top en corridas anteriores pueden volver a aparecer.

#### Scenario: URL ya elegida para un top anterior
- **WHEN** una URL estuvo en el top 10 de la semana pasada y vuelve a aparecer
- **THEN** no forma parte de los candidatos de la nueva corrida

### Requirement: Armado del top
El sistema SHALL ordenar los candidatos de cada fuente por su señal
(o por fecha si no tiene) y armar el top tomando de a uno por fuente según la
prioridad configurada, sin pasar el tope de cada fuente y hasta llegar al
tamaño configurado. Cada candidato del top tiene su posición.

#### Scenario: Tope por fuente
- **WHEN** el tope de arXiv es 4 y arXiv tiene 30 candidatos
- **THEN** el top tiene como máximo 4 candidatos de arXiv

#### Scenario: Pocas fuentes con candidatos
- **WHEN** las fuentes con candidatos no alcanzan a llenar el top respetando sus topes
- **THEN** el top queda con menos candidatos que el tamaño configurado

### Requirement: Parámetros configurables
El sistema SHALL leer de una única configuración del repo: las fuentes
habilitadas y su prioridad, el tope y la cantidad máxima de candidatos por
fuente, el tamaño del top, la ventana por defecto y los parámetros de cada
fuente (puntos mínimos, cuenta de GitHub, categorías y feeds).

#### Scenario: Cambiar el tamaño del top
- **WHEN** se cambia el tamaño del top de 10 a 8 en la configuración
- **THEN** la próxima corrida arma un top de hasta 8 candidatos

#### Scenario: Sumar un feed
- **WHEN** se agrega la URL de un feed RSS a la configuración
- **THEN** la próxima corrida incluye los ítems de ese feed

### Requirement: Tolerancia a fallas de una fuente
Si una fuente falla o no responde a tiempo, la corrida SHALL completarse con
las demás y registrar qué fuente falló y por qué. La página muestra esas
fallas junto a los resultados.

#### Scenario: Una fuente caída
- **WHEN** la API de arXiv responde con error
- **THEN** la corrida se completa con las otras fuentes y la página avisa que arXiv falló

#### Scenario: Todas las fuentes fallan
- **WHEN** todas las fuentes fallan
- **THEN** la corrida queda marcada como fallida, no mueve la ventana de la próxima corrida y la página muestra el error

### Requirement: Persistencia de corridas
El sistema SHALL guardar cada corrida con su ventana, su estado, quién la
lanzó y las fuentes que fallaron, y guardar todos sus candidatos con fuente,
señal, fecha y posición en el top si la tienen.

#### Scenario: Consultar el resto de los candidatos
- **WHEN** un admin mira la última corrida
- **THEN** ve el top en orden y, por separado, los candidatos que no llegaron al top

### Requirement: Corrida desde la terminal
El sistema SHALL ofrecer un comando que ejecuta la misma corrida desde la
terminal. Con la opción de prueba, imprime el top y los candidatos sin
escribir en la base.

#### Scenario: Prueba sin escribir
- **WHEN** alguien corre el comando con `--dry-run`
- **THEN** ve el top en la terminal y la base no cambia
