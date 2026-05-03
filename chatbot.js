// let tourismData = [];

// /* Load Dataset */

// fetch("./World_tourism_Final.json")
//   .then((res) => res.json())
//   .then((data) => {
//     tourismData = data["world tourism"] || data || [];

//     console.log("✅ Dataset loaded:", tourismData.length, "records");
//   })
//   .catch((err) => {
//     console.error("Dataset load error:", err);
//   });

// const API_KEY = "PASTE_YOUR_API_KEY_HERE";

// function toggleChatbot() {
//   const bot = document.getElementById("chatbot");

//   bot.style.display = bot.style.display === "flex" ? "none" : "flex";
// }

// /* MAIN CHAT FUNCTION */

// async function sendMessage() {
//   const input = document.getElementById("userInput");
//   const message = input.value.trim();

//   if (!message) return;

//   addMessage("You", message);

//   input.value = "";

//   const msg = message.toLowerCase();

//   /* Tourism topic filter */

//   const tourismKeywords = [
//     "tourism",
//     "travel",
//     "tourist",
//     "destination",
//     "country",
//     "trip",
//     "vacation",
//     "holiday",
//     "visit",
//     "explore",
//     "sightseeing",
//     "beach",
//     "mountain",
//     "city",
//     "resort",
//     "attraction",
//     "landmark",
//     "heritage",
//   ];

//   const isTourism = tourismKeywords.some((word) => msg.includes(word));

//   if (!isTourism) {
//     addMessage("AI", "I'm sorry, I can only answer tourism related questions.");

//     return;
//   }

//   /* DATASET SEARCH */

//   let datasetMatch = null;

//   for (let item of tourismData) {
//     const country = (item.Country || "").toLowerCase();

//     if (msg.includes(country)) {
//       datasetMatch = item;

//       break;
//     }
//   }

//   /* DATASET RESPONSE */

//   if (datasetMatch) {
//     const country = datasetMatch.Country;

//     const arrivals = datasetMatch.Tourist_Arrivals
//       ? datasetMatch.Tourist_Arrivals.toLocaleString()
//       : "N/A";

//     const receipts = datasetMatch.Tourism_Receipts
//       ? "$" + datasetMatch.Tourism_Receipts.toLocaleString()
//       : "N/A";

//     addMessage(
//       "AI",
//       `📊 ${country} receives about ${arrivals} tourists annually and generates tourism revenue of ${receipts}.`,
//     );

//     return;
//   }

//   /* GEMINI FALLBACK */

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `You are a tourism expert AI assistant.
// Answer this tourism question concisely:

// ${message}`,
//                 },
//               ],
//             },
//           ],
//         }),
//       },
//     );

//     const data = await response.json();

//     console.log("Gemini response:", data);

//     const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (reply) {
//       addMessage("AI", reply);
//     } else {
//       addMessage("AI", "Sorry, I couldn't generate a response.");
//     }
//   } catch (error) {
//     console.error(error);

//     addMessage("AI", "Error connecting to AI service.");
//   }
// }

// /* MESSAGE DISPLAY */

// function addMessage(sender, text) {
//   const chat = document.getElementById("chatbot-messages");

//   const msg = document.createElement("div");

//   msg.innerHTML = `<strong>${sender}:</strong> ${text}`;

//   chat.appendChild(msg);

//   chat.scrollTop = chat.scrollHeight;
// }

// /* ENTER KEY SUPPORT */

// document.getElementById("userInput").addEventListener("keypress", function (e) {
//   if (e.key === "Enter") {
//     e.preventDefault();

//     sendMessage();
//   }
// });

let tourismData = [];

/* LOAD DATASET */

fetch("./World_tourism_Final.json")
  .then((res) => res.json())
  .then((data) => {
    tourismData = data["world tourism"] || data || [];
    console.log("Dataset loaded:", tourismData.length);
  })
  .catch((err) => console.error("Dataset load error:", err));

const API_KEY = "AIzaSyCWj3QrUbiMka7lAiWO3-mRM0n4X4g0dIY";

/* CHAT TOGGLE */

function toggleChatbot() {
  const bot = document.getElementById("chatbot");
  bot.style.display = bot.style.display === "flex" ? "none" : "flex";
}

/* MAIN CHAT FUNCTION */

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage("user", message);

  input.value = "";

  const msg = message.toLowerCase();

  /* tourism filter */

  const tourismKeywords = [
    "tourism",
    "travel",
    "tourist",
    "destination",
    "vacation",
    "holiday",
    "trip",
    "visit",
    "tourist arrivals",
    "tourism revenue",
    "gdp tourism",
    "tourism receipts",
  ];

  const isTourism = tourismKeywords.some((word) => msg.includes(word));

  if (!isTourism) {
    addMessage("ai", "I can only answer tourism related questions.");
    return;
  }

  /* COUNTRY DETECTION */

  let matchedCountry = null;

  for (const item of tourismData) {
    const country = item.Country.toLowerCase();
    if (msg.includes(country)) {
      matchedCountry = country;
      break;
    }
  }

  /* FILTER RELEVANT DATA */

  let relevantData = [];

  if (matchedCountry) {
    relevantData = tourismData
      .filter((row) => row.Country.toLowerCase() === matchedCountry)
      .slice(0, 5); // limit rows
  }

  /* BUILD PROMPT */

  let prompt = "";

  if (relevantData.length > 0) {
    prompt = `
You are a tourism data analyst.

Use this dataset to answer the question.

Dataset:
${JSON.stringify(relevantData)}

Question:
${message}

Explain the tourism insights clearly.
`;
  } else {
    prompt = `
You are a tourism expert.

Answer this tourism question:

${message}
`;
  }

  /* GEMINI CALL */

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: prompt }],
//             },
//           ],
//         }),
//       },
//     );

//     const data = await response.json();

//     let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!reply) {
//       reply = "I couldn't generate a response.";
//     }

//     addMessage("ai", formatMarkdown(reply));
//   } catch (error) {
//     console.error(error);

//     addMessage("ai", "Error connecting to AI service.");
//   }
// }

      try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      addMessage("ai", `API Error ${response.status}. Check console logs.`);
      return;
    }

    const data = await response.json();
    let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) reply = "I couldn't generate a response.";

    addMessage("ai", formatMarkdown(reply));
  } catch (error) {
    console.error("Network/Fetch error:", error);
    addMessage("ai", "Error connecting to AI service.");
  }
}    
    
/* FORMAT MARKDOWN */

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

/* DISPLAY MESSAGE */

function addMessage(sender, text) {
  const chat = document.getElementById("chatbot-messages");

  const msg = document.createElement("div");

  msg.className = sender === "user" ? "user-msg" : "ai-msg";

  msg.innerHTML = text;

  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;
}

/* ENTER KEY */

document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Ensure chatbot starts closed
document.addEventListener("DOMContentLoaded", function() {
  const bot = document.getElementById("chatbot");
  if (bot) {
    bot.style.display = "none";
  }
});

