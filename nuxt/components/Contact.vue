<template>
  <div class="padder contactpadder" style="padding-top:24px;padding-bottom:24px;">
      <h1 class="emphasis"><span>Get in touch</span></h1>
      <p class="email">Send me an email at <a class="fancy" href="mailto:contact@piersdeseilligny.com" @click="emailclick">contact@piersdeseilligny.com</a> and let's have a chat over a coffee (or pint).</p>
      <Links v-if="!nolinks"/>


      <!--<form class="contact-form" @submit.prevent="sendEmail">
        <div class="inputcontainer">
          <input
            class="input"
            type="text"
            autocomplete="off"
            name="user_name"
            placeholder=" "
          />
          <label>Name</label>
        </div>
        <div class="inputcontainer">
          <input class="input" type="email" name="user_email" placeholder=" " />
          <label>Email address</label>
        </div>
        <div class="inputcontainer">
          <input class="input" type="text" name="user_email" placeholder=" " />
          <label>Subject</label>
        </div>
        <div class="inputcontainer" style="max-width: 340px">
          <textarea
            rows="6"
            class="input"
            name="message"
            placeholder=" "
          ></textarea>
          <label>Message</label>
        </div>
        <input type="submit" value="Send" />
      </form>-->
  </div>
</template>
<style scoped>

.email {
  color:var(--foreground);
  font-size:14px;
  margin-right:var(--rightmargin);
}

label {
  display: block;
  font-size: 11px;
  opacity: 0.5;
  transform: translate(12px, 23px) scale(1.1);
  transform-origin: 0 0;
  z-index: 5;
  position: relative;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
input {
  display: block;
  margin-bottom: 4px;
}
.inputcontainer {
  display: flex;
  flex-direction: column-reverse;
}
.input {
  z-index: 4;
  box-sizing: border-box;
  color: white;
  border: solid 1px transparent;
  border-bottom: solid 2px hsla(195, 50%, 60%, 0.5);
  transition: border 0.3s, box-shadow 0.3s;
  padding: 6px 12px;
  width: 100%;
  position: relative;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
  max-width: 240px;
}
.input:hover {
  border: solid 1px hsla(195, 50%, 60%, 0.5);
  border-bottom: solid 2px hsla(195, 50%, 60%, 0.75);
  box-shadow: 0 4px 24px black;
}
.input:focus {
  outline: none;
  border: solid 1px hsla(165, 50%, 60%, 1);
  border-bottom: solid 2px hsla(155, 50%, 60%, 1);
  box-shadow: 0 2px 6px black;
}
.input:focus + label,
.input:not(:placeholder-shown) + label {
  transform: translate(0) scale(1);
}

input[type="submit"] {
  margin-top: 24px;
  width: 100%;
  font-family: var(--font-primary);
  color: rgba(255, 255, 255, 0.75);
  background: linear-gradient(
    90deg,
    hsl(205, 30%, 19%, 1) 0%,
    hsl(165, 40%, 16%) 100%
  );
  border: none;
  padding: 8px;
  transition: all 0.3s;
  box-shadow: 0 0 0px black;
  max-width: 340px;
}
input[type="submit"]:hover {
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 24px black;
}
input[type="submit"]:active {
  background: var(--backgroundclick);
  box-shadow: 0 6px 12px black;
  outline: none;
}
textarea {
  display: block;
  min-width: 100%;
}
</style>
<script>
export default {
    props:["nolinks"],
    methods:{
      emailclick(){
        if(this.$matomo){
          this.$matomo.trackEvent('Clicks', 'Contact email');
        }
      }
    }
}
</script>
