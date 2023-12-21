import { importData } from "./methods/importData.js";
import { mapData } from "./methods/mapData.js";

importData(
    '', // caminho para o arquivo a ser importado
    '', // token
    'LOCAL' // chave da URL > utils > urls
)

mapData(
    '', // caminho para o arquivo a ser mapeado
    'dummyName', // output name
    '', // token
    'STORAGE_STG' // chave da URL > utils > urls
)