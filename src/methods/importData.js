import fs from "node:fs"
import { createAxiosInstance } from "../service/axios.js"

export async function importData(filePath, token, urlKey) {
    const api = createAxiosInstance(token, urlKey)
    const json = fs.readFileSync(filePath, 'utf-8')

    try {
        const bloodGradeList = JSON.parse(json)
        let importedItems = 1
        const totalItems = bloodGradeList.length

        console.log("Starting import")

        for (const item of bloodGradeList) {
            try {
                console.log("Processing... ", `${importedItems}/${totalItems}`)
                await api.post('/register-category', item)
                console.log("Successfully created.")
                importedItems++   
            } catch (error) {
                console.log("Error creating blood grade", error)
            }
        }

    } catch (error) {
        console.log("Error parsing json", error)
        return
    }
    console.log("Import finished.")
}