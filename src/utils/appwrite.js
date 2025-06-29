import { Client, Databases, ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

const databases = new Databases(client);

export const saveTweets = async (tweetID, tweetOutput, userInput) => {
    try {
        const result = await databases.createDocument(
            DATABASE_ID, 
            COLLECTION_ID, 
            ID.unique(),
            {
                GeneratedTweets: tweetOutput,
                id_number: tweetID,
                userInput: userInput
            }
        );

        return result;
    } catch (error) {
        console.error("Error saving tweet: ", error)
    }
}

export const getSavedTweets = async () => {
    try {
        const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        return result.documents;
    } catch (error) {
        console.error("Error fetching saved Tweets: ", error)
    }
}