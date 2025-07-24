const fetchQuestions = async (amount = 5, category = 18, maxRetries = 3) => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Fixed: Added backticks for template literal
      const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&type=multiple`;
      
      const response = await fetch(url, {
        // Remove the Content-Type header - it's not needed for GET requests
        // and causes CORS issues with Open Trivia DB
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      // Check for specific error codes
      if (response.status === 402) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
      
      if (response.status === 429) {
        // Rate limited, wait before retry
        if (attempt < maxRetries) {
          console.warn(`Rate limited, retrying in ${attempt * 2} seconds...`);
          await delay(attempt * 2000);
          continue;
        }
        throw new Error("Too many requests. Please try again later.");
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if API returned an error response
      if (data.response_code !== 0) {
        const errorMessages = {
          1: "No results found for the specified parameters",
          2: "Invalid parameter provided",
          3: "Token not found",
          4: "Token empty"
        };
        throw new Error(errorMessages[data.response_code] || "API returned an error");
      }
      
      // Helper function to decode HTML entities
      const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
      };
      
      // Fixed: Changed 'questions' to 'question' to match the parameter name
      return data.results.map((question, index) => ({
        id: `question${index + 1}`,
        text: decodeHTML(question.question), // Use decodeHTML instead of decodeURIComponent
        answers: [
          decodeHTML(question.correct_answer),
          ...question.incorrect_answers.map((ans) => decodeHTML(ans)),
        ],
      }));
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // If it's the last attempt or a non-retryable error, throw
      if (attempt === maxRetries || error.name === 'AbortError') {
        throw error;
      }
      
      // Wait before retrying
      await delay(1000 * attempt);
    }
  }
};

export default fetchQuestions;