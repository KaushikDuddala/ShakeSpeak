const circle = document.querySelector('.circle');
const bar = document.querySelector('.bar');
const messageBox = document.querySelector('#messageBox');
const output = document.querySelector('#output');

let isDragging = false;
let initialX = 0;

const snapPoints = [0, 450/2, 450]; // Define the snap points

circle.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - circle.getBoundingClientRect().left;
});

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const barLeft = bar.getBoundingClientRect().left;
    const barWidth = bar.offsetWidth;
    const circleWidth = circle.offsetWidth;
    const maxX = barWidth - circleWidth;
    
    const newX = e.clientX - barLeft - initialX;
    
    // Snap the circle to the nearest snap point
    const snapX = snapPoints.reduce((prev, curr) => {
        return (Math.abs(curr - newX) < Math.abs(prev - newX) ? curr : prev);
    });
    
    bar.style.background = `linear-gradient(to right, red ${newX + 20}px, white ${newX}px)`;
    circle.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        
        // Find the nearest snap point
        const currentX = parseInt(circle.style.left);
        const nearestSnapX = snapPoints.reduce((prev, curr) => {
            return (Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev);
        });
        bar.style.background = `linear-gradient(to right, red ${nearestSnapX + 20}px, white ${nearestSnapX}px)`;
        
        
        // Calculate the distance to glide
        const distanceToGlide = Math.abs(nearestSnapX - currentX);
        const glideDuration = 100; // Adjust the duration as needed
        
        // Apply CSS transition for smooth glide effect
        circle.style.transition = `left ${glideDuration}ms ease-out`;
        circle.style.left = `${nearestSnapX}px`;
        
        // Reset transition after glide is complete
        setTimeout(() => {
            circle.style.transition = '';
        }, glideDuration);
        
        if(messageBox.value == '')
        {
            dropdownTrigger();
        }
        else
        {
            gptTrigger();
        }
    }
});

async function getResponse(input, type) {
    const url = 'https://api.shuttleai.app/v1/chat/completions';
    let typePrompt = "";
    if(type == "modern") {
        typePrompt = "in modern language but slightly better worded";
    }
    else if(type == "shakespearian") {
        typePrompt = "in shakespearian language";
    }
    else{
        return input;
    }
    const models = ["gpt-3.5-turbo-16k", "gpt-3.5-turbo-0301", "gpt-3.5-turbo-1106", "gpt-3.5-turbo-16k-0613", "chatgpt"]
    const data = `{
        "model": "${models[Math.floor(Math.random()*models.length)]}",
        "messages": [{"role": "user", "content": "generate ${input} ${typePrompt} and only say the translation"}],
        "temperature": 1,
        "max_tokens": 15
    }`;
    output.textContent = "Loading... (This may take while, consider refreshing or trying again later if it doesn't seem to work)";


    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer shuttle-68z3d6z7jasl1udc630z',
            'Content-Type': 'application/json',
        },
        body: data,
    });
    
    
    const text = await response.json();
    
    try{
        return text.choices[0].message.content;
    }
    catch(e){
        return "Sorry, we hit an error, please try again later or refresh the page. This may happen after over-use of the program in order to prevent overload! Thank you for trying ShakeSpeak. (For information, this doesn't always happen but there's limits on usage and that may have been hit)."
    }
}

async function gptTrigger()
{
    const input = messageBox.value;
    let type = "";
    if(circle.style.left == "225px") type="modern";
    else if(circle.style.left == "450px") type="shakespearian";
    const response = await getResponse(input, type);
    console.log(response);
    output.textContent = response;
}

messageBox.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        gptTrigger();
    }
});


async function dropdownTrigger()
{
    const selectedOption = dropdown.value;
    let outputText = "";
    if(selectedOption == "beautiful")
    {
        if(circle.style.left == "450px")
        {
            outputText = "Thou art a radiant sun amidst the celestial expanse, casting thy luminous beauty upon the world."
        }
        else if(circle.style.left == "225px"){
            ouputText = "You're absolutely stunning"
        }
        else
        {
            outputText = "You're beautiful"
            
        }
    }
    else if(selectedOption == "leave")
    {
        if(circle.style.left == "450px")
        {
            outputText = "I still will stay with thee and never from the palace of dim night depart again"
        }
        else if(circle.style.left == "225px"){
            outputText = "I will remain by your side forever."
        }
        else
        {
            outputText = "I'll never leave you.";
        }
    }
    else if(selectedOption == "sorry")
    {
        if(circle.style.left == "450px")
        {
            outputText = "I humbly proffer my contrite apologies, beseeching thy forgiveness from the unwitting transgressions that have caused thee distress.";
        }
        else if(circle.style.left == "225px"){
            outputText = "I sincerely apologize for my actions which were very terrible."
        }
        else
        {
            outputText = "I'm sorry"
            
        }
    }
    else if(selectedOption == "perfect")
    {
        if(circle.style.left == "450px")
        {
            outputText = "As all the world — why, he's a man of wax."
        }
        else if(circle.style.left == "225px"){
            outputText = "He is so absolutely perfect"
        }
        else
        {
            outputText = "He's perfect"
            
        
        }
    }
    output.textContent = outputText; // Modify the output p tag to the selected option
}
dropdown.addEventListener('change', () => {
    dropdownTrigger();
});