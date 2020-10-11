## Build Image
* Reemplazar tagname por la version de la imagen (misma version que git)
`docker build -t cincarnato/dracul-media:tagname .`

## PUSH Image

`docker push cincarnato/dracul-media`

## Docker deploy development with run

`docker run -it --network="host" -p 8888:5000 cincarnato/dracul-media`

## Docker deploy with compose

`docker-compose up -d`

## Stack deploy
`docker stack deploy -c docker-compose.yml stackName`