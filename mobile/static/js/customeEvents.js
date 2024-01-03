// ---------------------------- localStorage events
// create Event
function localStorageChanged(key, oldValue, newValue) {
  // ignore if values are same
  if (JSON.stringify(oldValue) === JSON.stringify(newValue)) return  
  // Create Event
  const e = new Event('localStorageChanged');
  // set Event values
  e.key = key;
  e.oldValue = oldValue;
  e.newValue = newValue;
  // Trigger Event
  window.dispatchEvent(e);
}

// Override the default setItem method of localStorage to Trigger Event
const localStorage_setItem = localStorage.setItem;
localStorage.setItem = (key, value)=>{
  const oldValue = localStorage.getItem(key);
  localStorage_setItem.apply(this, arguments); // call origianl setItem()
  localStorageChanged(key, oldValue, value); // Trigger Event
};
