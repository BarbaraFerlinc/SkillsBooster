const db = require('../pb');

const fs = require('fs');
const path = require('path');

class Znanje {
    static getModelData(domain) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, '../folder_details.json');

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject('Napaka pri branju datoteke: ' + err.message);
                }

                const models = JSON.parse(data);

                const domainModel = models.find(model => model.name === domain);
                if (domainModel && domainModel.model) {
                    return resolve(domainModel);
                } else {
                    const genericModel = models.find(model => model.name === 'generickidomena');
                    return resolve(genericModel);
                }
            });
        });
    }

    static async accessModel(domain, query) {
        try {
            const modelData = await this.getModelData(domain);
            if (!modelData) {
                throw new Error('Model ni najden');
            }

            const url = `https://api.gradient.ai/api/models/${modelData.model}/complete`;

            const payload = {
                autoTemplate: true,
                query: query,
                maxGeneratedTokenCount: 200
            };

            const headers = {
                accept: "application/json",
                "x-gradient-workspace-id": "86abdbb7-ca5f-4f71-9882-01970e111de7_workspace",
                "content-type": "application/json",
                authorization: "Bearer zHkm0nTvAVXsUobrgw4UelOfRQsKRCl2"
            };

            const response = await axios.post(url, payload, { headers });
            return response.data;
        } catch (error) {
            throw new Error('Napaka pri dostopu do modela: ' + (error.response ? error.response.data : error.message));
        }
    }
}

module.exports = Znanje;
