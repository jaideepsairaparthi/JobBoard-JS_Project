let jobsData = []; // Define jobsData globally

// Using async/await:
async function fetchData() {
    try {
      const response = await fetch('db.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      jobsData = jsonData; // Populate jobsData with fetched data
      filterJobs(); // Initial Render after data is fetched
    } catch (error) {
      console.error('Error:', error);
    }
  }

fetchData();

const favoriteList = [];
const cartBadge = document.getElementById("cart-badge");
const jobCardsContainer = document.getElementById("unique-job-cards-container");
const likedCardsContent = document.getElementById("liked-cards-content");
const likedCardsPopup = document.getElementById("liked-cards-popup");

// Pagination variables
const jobsPerPage = 8; // Number of jobs to display per page
let currentPage = 1;

// Create Job Card
function createJobCard(job) {
    const mainContainer = document.createElement("div");
    mainContainer.className = "unique-main-container";

    mainContainer.innerHTML = `
        <div class="unique-container">
            <div class="unique-img-container">
                <img alt="company logo" loading="lazy" src="${job.logo}" class="unique-company-logo">
            </div>
            <div class="unique-card-heading">
                <div>
                    <h3>${job.title}</h3><br>
                    <h4>${job.company}</h4>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button id="heart-button" onclick="toggleFavorite(event, '${job.title}')">❤</button>
                    <button id="unique-search-button"><span>apply</span></button>
                </div>
            </div>
        </div>
        <div class="unique-p-tag"><br><br>
            <p>${job.description}</p>
        </div><hr id="unique-hr">
        <div class="unique-icons">
            <img src="https://cdn.prod.website-files.com/64943f2936915879aa1dae17/6499704a3e6957bb58863309_globe-01.svg" alt="location icon"> ${job.location}&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="https://cdn.prod.website-files.com/64943f2936915879aa1dae17/64997063d4816cfd4fcfaefd_home-smile.svg" alt="remote icon"> ${job.remote}&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="https://cdn.prod.website-files.com/64943f2936915879aa1dae17/6499727f529708c661f671a7_bank-note-01.svg" alt="salary icon"> ${job.salary}
        </div>
    `;

    return mainContainer;
}

// Toggle Favorite
function toggleFavorite(event, title) {
    const button = event.currentTarget;
    button.classList.toggle("active");
    if (favoriteList.includes(title)) {
        favoriteList.splice(favoriteList.indexOf(title), 1);
    } else {
        favoriteList.push(title);
    }
    cartBadge.textContent = favoriteList.length; // Update cart badge count
    updateLikedCards();
}

// Update Liked Cards
function updateLikedCards() {
    likedCardsContent.innerHTML = ""; // Clear existing content
    favoriteList.forEach(title => {
        const job = jobsData.find(job => job.title === title);
        if (job) {
            const likedCard = createJobCard(job);
            likedCardsContent.appendChild(likedCard);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("liked-cards-popup");
    popup.style.display = "none"; // Ensure it's hidden
});


// Show Liked Cards
function showLikedCards() {
    likedCardsPopup.style.display = "flex";
}

// Close Liked Cards
function closeLikedCards() {
    likedCardsPopup.style.display = "none";
}

// Filter Jobs
function filterJobs() {
    const query = searchBar.value.toLowerCase();
    const category = filterCategory.value;
    const type = filterType.value;
    let filteredJobs = jobsData.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query)
    );

    if (category !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.category === category);
    }

    if (type !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.remote === type);
    }

    if (sortOptions.value === 'salary') {
        filteredJobs = filteredJobs.sort((a, b) => parseInt(b.salary.replace('$', '')) - parseInt(a.salary.replace('$', '')));
    } else if (sortOptions.value === 'title') {
        filteredJobs = filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderJobs(filteredJobs);
}

// Render Jobs
function renderJobs(jobs) {
    jobCardsContainer.innerHTML = ""; // Clear existing job cards

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToDisplay = jobs.slice(startIndex, endIndex);

    jobsToDisplay.forEach(job => {
        const jobCard = createJobCard(job);
        jobCardsContainer.appendChild(jobCard);
    });

    updatePageIndicator();
}

// Update Page Indicator
function updatePageIndicator() {
    const pageIndicator = document.getElementById('page-indicator');
    pageIndicator.textContent = `Page ${currentPage}`;
}

// Next Page
function nextPage() {
    const totalPages = Math.ceil(jobsData.length / jobsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        filterJobs();
    }
}

// Previous Page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        filterJobs();
    }
}

// Event Listeners
const searchBar = document.getElementById('searchBar');
const filterCategory = document.getElementById('filterCategory');
const filterType = document.getElementById('filterType');
const sortOptions = document.getElementById('sortOptions');


searchBar.addEventListener('input', filterJobs);
filterCategory.addEventListener('change', filterJobs);
filterType.addEventListener('change', filterJobs);
sortOptions.addEventListener('change', filterJobs);

// Pagination Event Listeners
document.getElementById('next-page').addEventListener('click', nextPage);
document.getElementById('prev-page').addEventListener('click', prevPage);

// Initial Render
filterJobs();

// Theme toggle function
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    if (body.classList.contains('dark-mode')) {
        // Switch to light mode
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light-mode'); // Save theme preference
    } else {
        // Switch to dark mode
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark-mode'); // Save theme preference
    }
}

// Load saved theme from localStorage
function loadTheme() {
    const themeIcon = document.getElementById('theme-icon');
    
    // Always set dark mode as the default theme
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    
    // Optionally, save dark mode as the theme preference
    localStorage.setItem('theme', 'dark-mode');
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme(); // Apply dark mode by default
});

function toggleTheme() {
    const body = document.body;
    const logo = document.getElementById('logo');
    const themeIcon = document.getElementById('theme-icon');

    // Toggle between dark and light mode
    body.classList.toggle('light-mode');

    // Change the logo based on the theme
    if (body.classList.contains('light-mode')) {
        logo.src = 'log1.jpg'; // Path to your light mode logo
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        logo.src = 'logo (2).png'; // Path to your dark mode logo
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper")
const fileCancelButton = document.querySelector("#file-cancel")
const chatbotToggler = document.querySelector("#chatbot-toggler")
const closeChatbot = document.querySelector("#close-chatbot")
const Apply = document.getElementById("sbtn");



// API setup
const API_KEY ="AIzaSyBOaWi_0nIn68W--3v8vP471_-33_TuSJI"
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

const userData= {
    message:null,
    file:{
        data:null,
        mime_type:null
    }
}

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

//Create message element with dynamic classes and return it
const createMessageElement =(content,...classes)=>{
const div =document.createElement("div")
div.classList.add("message",...classes);
div.innerHTML=content;
return div;
}

// Generate bot response using API
const generateBotResponse = async(incomingMessageDiv)=>{
    const messageElement  = incomingMessageDiv.querySelector(".message-text");
    
    //Add user message response to chat history
    chatHistory.push({
        role:"user",
        parts:[{text:userData.message},...(userData.file.data ? [{inline_data : userData.file}] : [])]
    });

    //API request options
    const requestOptions = {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({
            contents:chatHistory
        })
    }

    try{
        //fetch bot response from API
        const response = await fetch(API_URL,requestOptions)
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        //Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
        messageElement.innerText = apiResponseText;

        //Add bot response to chat history
        chatHistory.push({
            role:"model",
            parts:[{text:apiResponseText}]
        });
    }
    catch(error){
    //error handling in API response
    console.log(error);
    messageElement.innerText=error.message;
    messageElement.style.color="#ff0000";
    }
    finally{
    //reset user's file data, removing thinking and scroll chat to bottom 
        userData.file={};
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"})
    }
}

const handleOutgoingMessage=(e)=>{
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded")
    messageInput.dispatchEvent(new Event("input"));

//create and display user message
const messageContent =`<div class="message-text"></div>${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>` : ""}`;

const outgoingMessageDiv=createMessageElement(messageContent,"user-message")
outgoingMessageDiv.querySelector(".message-text").textContent =userData.message
chatBody.appendChild(outgoingMessageDiv);
chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"})

//Simulate bot response with thinking indicator after a delay
setTimeout(()=>{
    const messageContent =`<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>    
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

    const incomingMessageDiv=createMessageElement(messageContent,"bot-message","thinking")
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"})
    generateBotResponse(incomingMessageDiv);
},600);
}

//Handle Enter key press for sending messages
messageInput.addEventListener("keydown",(e)=>{
    const userMessage = e.target.value.trim();
    if(e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768){
        handleOutgoingMessage(e);
    }
})

//adjust input field height dynamically
messageInput.addEventListener("input",()=>{
    messageInput.style.height=`${initialInputHeight}px`
    messageInput.style.height=`${messageInput.scrollHeight}px`
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px"
});

//handle file input change and preview the selected file
fileInput.addEventListener("change",()=>{
    const file = fileInput.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload=(e)=>{
        fileUploadWrapper.querySelector("img").src=e.target.result;
        fileUploadWrapper.classList.add("file-uploaded")
    const base64String =e.target.result.split(",")[1];
    //store file data in userData
    userData.file={
            data:base64String,
            mime_type:file.type
        }
        fileInput.value="";
    }
    reader.readAsDataURL(file)
})

//Cancel file upload
fileCancelButton.addEventListener("click", ()=>{
    userData.file={};
    fileUploadWrapper.classList.remove("file-uploaded");
})

//Initialize emoji picker
const picker = new EmojiMart.Picker({
    theme:"light",
    skinTonePosition:"none",
    previewPosition:"none",
    onEmojiSelect:(emoji)=>{
        const {selectionStart:start,selectionEnd:end} =messageInput;
        messageInput.setRangeText(emoji.native,start,end,"end");
        messageInput.focus()
    },
    onClickOutside:(e)=>{
        if(e.target.id==="emoji-picker"){
            document.body.classList.toggle("show-emoji-picker");
        }else{
            document.body.classList.remove("show-emoji-picker");
        }
    }
})

document.querySelector(".chat-form").appendChild(picker)

sendMessageButton.addEventListener("click",(e)=> handleOutgoingMessage(e))
document.querySelector("#file-upload").addEventListener("click",()=> fileInput.click());
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click",()=> document.body.classList.remove("show-chatbot"));


function toggleNav() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// Get the modal and button elements
const subscriptionModal = document.getElementById("subscription-message-modal");
const subscribeButton = document.getElementById("Subscribe");
const closeModalButton = document.querySelector(".close-modal");
const emailInput = document.querySelector(".search-container1 input[type='text']");

// Function to open the modal
function openModal() {
    subscriptionModal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    subscriptionModal.style.display = "none";
}

// Event listener for the subscribe button
subscribeButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = emailInput.value.trim();

    if (email) {
        // Simulate subscription (replace with actual API call)
        console.log("Subscribed with email:", email);
        openModal(); // Show the success modal
        emailInput.value = ""; // Clear the input field
    } else {
        alert("Please enter a valid email address."); // Show an error if the input is empty
    }
});

// Event listener for the close button
closeModalButton.addEventListener("click", closeModal);

// Close the modal if the user clicks outside of it
window.addEventListener("click", (e) => {
    if (e.target === subscriptionModal) {
        closeModal();
    }
});














