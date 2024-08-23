// Common elements
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotOptions = document.querySelector(".chatbot-options");
const optionButtons = document.querySelectorAll(".option-btn");
const chatbots = document.querySelectorAll(".chatbot");

// Chat with Question elements
const questionChatInput = document.querySelector(
  ".chatbot-question .chat-input textarea"
);
const questionSendBtn = document.querySelector(
  ".chatbot-question .chat-input span"
);
const questionChatbox = document.querySelector(".chatbot-question .chatbox");

// Chat with Image elements
const imageChatInput = document.querySelector(
  ".chatbot-image .chat-input input"
);
const imageSendBtn = document.querySelector(".chatbot-image .chat-input span");
const imageChatbox = document.querySelector(".chatbot-image .chatbox");
const dropArea = document.querySelector(".drop-area");

// Chat with Image URL elements
const imageURLChatInput = document.querySelector(
  ".chatbot-image-url .chat-input textarea"
);
const imageURLSendBtn = document.querySelector(
  ".chatbot-image-url .chat-input span"
);
const imageURLChatbox = document.querySelector(".chatbot-image-url .chatbox");


// Chat with Math Equation
const mathChatInput = document.querySelector(
  ".chatbot-math .chat-input textarea"
);
const mathSendBtn = document.querySelector(
  ".chatbot-math .chat-input span"
);
const mathChatbox = document.querySelector(".chatbot-math .chatbox");

let userMessage;
const QUESTION_API_KEY = "your-question-api-key";
const IMAGE_API_KEY = "your-image-api-key";
const IMAGE_URL_API_KEY = "your-image-url-api-key";
const MATH_URL_API_KEY = "your-image-url-api-key";

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-icons">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const generateQuestionResponse = (incomingChatLi, chatbox) => {
  const API_URL = "http://127.0.0.1:5000/solve_text";
  const messageElement = incomingChatLi.querySelector("p");
  console.log(userMessage);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_input: userMessage }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        console.log(data);
        messageElement.innerHTML = data.steps;
      } else {
        messageElement.textContent = "Something went wrong, please try again!";
      }
    })
    .catch((error) => {
      messageElement.textContent = "Something went wrong, please try again!";
    })
    .finally(() => (chatbox.scrollTop = chatbox.scrollHeight));
};

const generateImageResponse = (incomingChatLi, chatbox) => {
  const API_URL = "http://127.0.0.1:5000/solve_image_upload";
  const messageElement = incomingChatLi.querySelector("p");
  const formData = new FormData();
  // formData.append("image", imageChatInput.files[0]);
  const file = imageChatInput.files[0];

  if (!file) {
    messageElement.textContent = "No file selected. Please upload an image.";
    return;
  }

  formData.append("image", file);
  const requestOptions = {
    method: "POST",
    body: formData,
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        // console.log(data);
        messageElement.innerHTML = data.steps;
      } else {
        messageElement.textContent = "Something went wrong, please try again!";
      }
    })
    .catch((error) => {
      messageElement.textContent = "Something went wrong, please try again!";
    })
    .finally(() => (chatbox.scrollTop = chatbox.scrollHeight));
};

const generateImageURLResponse = (incomingChatLi, chatbox) => {
  const API_URL = "http://127.0.0.1:5000/solve_image_url";
  const messageElement = incomingChatLi.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: userMessage,
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        // console.log(data);
        messageElement.innerHTML = data.steps;
      } else {
        messageElement.textContent = "Something went wrong, please try again!";
      }
    })
    .catch((error) => {
      messageElement.textContent = "Something went wrong, please try again!";
    })
    .finally(() => (chatbox.scrollTop = chatbox.scrollHeight));
};

const generateMathResponse = (incomingChatLi, chatbox) => {
  const API_URL = "";
  const messageElement = incomingChatLi.querySelector("p");
  console.log(userMessage);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_input: userMessage }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        console.log(data);
        messageElement.innerHTML = data.steps;
      } else {
        messageElement.textContent = "Something went wrong, please try again!";
      }
    })
    .catch((error) => {
      messageElement.textContent = "Something went wrong, please try again!";
    })
    .finally(() => (chatbox.scrollTop = chatbox.scrollHeight));
};

const handleChat = (inputElement, chatbox, type, apiKey) => {
  if (type !== "image") {
    userMessage = inputElement.value.trim();
    if (!userMessage) return;
    inputElement.value = "";
  }

  chatbox.appendChild(
    createChatLi(userMessage || "Uploading image...", "outgoing")
  );
  chatbox.scrollTop = chatbox.scrollHeight;

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTop = chatbox.scrollHeight;

    if (type === "question") {
      generateQuestionResponse(incomingChatLi, chatbox);
    } else if (type === "image") {
      generateImageResponse(incomingChatLi, chatbox);
    } else if (type === "image-url") {
      generateImageURLResponse(incomingChatLi, chatbox);
    } else if (type==="math") {
      generateMathResponse(incomingChatLi, chatbox);
    }
  }, 600);
};

optionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedOption = event.currentTarget.dataset.option;
    chatbotOptions.style.display = "none";
    chatbots.forEach((chatbot) => (chatbot.style.display = "none"));
    document.querySelector(`.chatbot-${selectedOption}`).style.display =
      "block";
  });
});

chatbotToggler.addEventListener("click", () => {
  const isOptionsVisible = chatbotOptions.style.display === "flex";
  chatbotOptions.style.display = isOptionsVisible ? "none" : "flex";
  chatbots.forEach((chatbot) => (chatbot.style.display = "none"));
  document.body.classList.toggle("show-chatbot", !isOptionsVisible);
});

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    chatbots.forEach((chatbot) => (chatbot.style.display = "none"));
    document.body.classList.remove("show-chatbot");
  });
});

questionSendBtn.addEventListener("click", () =>
  handleChat(questionChatInput, questionChatbox, "question", QUESTION_API_KEY)
);
imageSendBtn.addEventListener("click", () =>
  handleChat(imageChatInput, imageChatbox, "image", IMAGE_API_KEY)
);
imageURLSendBtn.addEventListener("click", () =>
  handleChat(imageURLChatInput, imageURLChatbox, "image-url", IMAGE_URL_API_KEY)
);

mathSendBtn.addEventListener("click", () =>
handleChat(mathChatInput, mathChatbox, "math", MATH_URL_API_KEY)
);


// Drag and Drop functionality for images
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("dragover");
  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith("image/")) {
    imageChatInput.files = files;
  }
});

dropArea.addEventListener("click", () => imageChatInput.click());

imageChatInput.addEventListener("change", () => {
  if (imageChatInput.files.length > 0) {
    console.log(imageChatInput.files[0]); // This line is just for debugging to confirm file selection
  }
});
