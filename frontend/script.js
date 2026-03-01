// DARK MODE
const toggle=document.getElementById("themeToggle");
toggle.onclick=()=>{
 document.body.classList.toggle("dark");
 toggle.textContent=
 document.body.classList.contains("dark")?"☀️":"🌙";
};


// SCROLL BUTTON
function scrollToForm(){
 document.getElementById("form")
 .scrollIntoView({behavior:"smooth"});
}


// RESULT SYSTEM (CONNECTED TO BACKEND)
const form=document.getElementById("eligibilityForm");
const resultSection=document.getElementById("resultSection");
const progressFill=document.getElementById("progressFill");
const resultTitle=document.getElementById("resultTitle");
const backendText=document.getElementById("backendResult");

if(form){

form.addEventListener("submit",async(e)=>{
 e.preventDefault();

 const formData=new FormData(form);
 const name=formData.get("name") || "User";

 resultTitle.textContent=`Results for ${name}`;
 backendText.textContent="🤖 Analyzing eligibility...";

 resultSection.style.display="block";
 resultSection.scrollIntoView({behavior:"smooth"});

 setTimeout(()=>{
  resultSection.classList.add("show");
 },100);

 try{

  const res=await fetch("http://127.0.0.1:8000/check",{
   method:"POST",
   body:formData
  });

  const data=await res.json();

  backendText.textContent=data.message;

  progressFill.style.width=data.score+"%";
  progressFill.textContent=data.score+"%";

 }
 catch(err){
  backendText.textContent="❌ Server error. Please try again.";
 }

});

}


// CTA SCROLL
function goToSchemes(){
 document.getElementById("schemes")
 .scrollIntoView({behavior:"smooth"});
}


// REVEAL ANIMATION
const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){
   entry.target.style.opacity=1;
   entry.target.style.transform="translateY(0)";
  }
 });
});

document.querySelectorAll(".card,.scheme-card,.testimonial")
.forEach(el=>{
 el.style.opacity=0;
 el.style.transform="translateY(40px)";
 el.style.transition=".6s ease-out";
 observer.observe(el);
});