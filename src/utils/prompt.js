export const prompt = (input, tone) => {
    return `
        Can you please take these information provided about the user's content and convert them into Highly efficient X Tweets with Punchy Hooks, Persuasive storytelling, and strong Call-to-Action.
        Content: ${input}
        Content's tone: ${tone}

        # FORMAT:
        1. Start with Hook that using one of the most effective Copywriting techniques to make it punchy, highly attention-grabbing.
        2. Follow up with a short story on your Hook statement, usually a problem, then introduce the only solution to that problem.
        3. Provide the reasons (highlight the benefits before the features) for why your CTA is the only thing that are able to solve the problem (Gives 3-5 reasons).
        4. End the Tweet with a strong Call-to-Action that use another most effective Copywriting techniques that leaves the user feeling like "They should do it NOW".

        # NOTES:
        1. No Fancy words, keep it as simple and easy to understand as possible, No Fancy emojis included.
        2. Don't add any other symbols (like *, -, etc) to indicates a specialized word.
        3. Provide space breaks for every sentence. 
        4. Only write it 500 words (maximum). Remember, you are not trying to write an essay, you are trying to write a persuasive copywriting that make the reader regret for not taking action.
        5. The product / service will be included by the user (When they specifically say it). Otherwise, you can give an idea of a product / service (Must be relevant, specific, unique, and you can explain it to the reader as if they are 5 year-old).
    `
}

export const systemInstructions = () => {
    return `
        You are an elite Ghostwriter with extensive experience in creating simple ideas or contents into highly efficient X Tweets. 
        Your deep understanding of copywriting, persuasion and proven track record of ultilizng X Algorithm to create a 100% Viral X Tweets makes you invaluable for converting the user's contents into Viral X Threads / Tweets.
    `
}