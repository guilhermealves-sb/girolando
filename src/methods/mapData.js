import fs from "node:fs"
import { createAxiosInstance } from "../service/axios.js"
import { omit } from "../utils/omit.js"
import { formatName } from "../utils/formatter.js"

export async function mapData(filePath, newFileName, token, urlKey) {
    const api = createAxiosInstance(token, urlKey)
    const json = fs.readFileSync(filePath, 'utf-8')
    
    try {
        const itemsList = JSON.parse(json)
        let mappedItems = 0
        let skippedItems = 0
        const totalItems = itemsList.length

        console.log("Starting mapping")

        const mappedList = []

        for (const item of itemsList) {
            try {
                console.log("Processing... ", `${mappedItems + skippedItems}/${totalItems}`)
                const { data: categoriesData } = await api.get('/category?productTypeId=22')
                const category = categoriesData.categorys.find((category) => category.desc == formatName(item.species))
                
                if (!category?.id) {
                    console.log("SpeciesId not found for item: ", item)
                    console.log("Skipping...")
                    skippedItems++
                    continue
                }

                const { data: subCategoriesData } = await api.get(`/sub-category?categoryId=${category?.id}&limit=300`)
                const subCategory = subCategoriesData.subCategorys.find((subCategory) => subCategory.desc == formatName(item.breed))

                if (!subCategory?.id) {
                    console.log("BreedId not found for item: ", item)
                    console.log("Skipping...")
                    skippedItems++
                    continue
                }

                mappedList.push({
                    ...omit(item, ['species', 'breed']),
                                        speciesId: category?.id,
                    breedId: subCategory?.id
                })
                mappedItems++
                console.log("Mapped item, going to the next...")
            } catch (error) {
                console.log("Error fetching data", error)
                return
            }
        }

        const mappedItemsJson = JSON.stringify(mappedList)

        if (!fs.existsSync('./dist/')) {
            fs.mkdirSync('./dist/');
        }

        fs.writeFileSync(`./dist/${newFileName}.json`, mappedItemsJson, 'utf8', function (err) {
            if (err) throw err;
            console.log('New file created', newFileName);
            console.log("Mapped items: ", mappedItems)
            console.log("Skipped items: ", skippedItems) 
        }); 
    } catch (error) {
        console.log("Error parsing json", error)
        return
    }
    console.log("Mapping finished.")
}