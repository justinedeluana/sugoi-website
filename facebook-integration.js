/**
 * Enhanced Facebook SDK integration with proper error handling and delayed initialization
 * This will help prevent "Could not find element" errors by ensuring the DOM is ready
 */

// Wait for window to fully load before initializing Facebook
window.addEventListener('load', function() {
  // Delay Facebook initialization slightly to ensure DOM is fully ready
  setTimeout(initFacebook, 500);
});

function initFacebook() {
  // Only initialize if we have Facebook container
  const fbContainer = document.querySelector('#fb-root');
  if (!fbContainer) return;
  
  // Initialize Facebook SDK with error handling
  window.fbAsyncInit = function() {
    try {
      FB.init({
        appId: '', // Optional: add your app ID if you have one
        xfbml: true,
        version: 'v18.0'
      });
      
      // Enable debugging messages in console
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        FB.Event.subscribe('xfbml.render', function(msg) {
          console.log('Facebook rendered successfully:', msg);
        });
        
        FB.Event.subscribe('xfbml.error', function(msg) {
          console.error('Facebook rendering error:', msg);
        });
      }
      
      // Force re-parse after SDK is fully loaded (important fix)
      FB.XFBML.parse();
    } catch (e) {
      console.error('Error initializing Facebook SDK:', e);
    }
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    // Add error handling for script load
    js.onerror = function() {
      console.error('Failed to load Facebook SDK');
      // Create a fallback message
      const fbElements = document.querySelectorAll('.fb-page, .fb-post, .fb-like');
      fbElements.forEach(el => {
        el.innerHTML = '<p>Facebook content could not be loaded. Please refresh the page.</p>';
      });
    };
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

// Add a global error handler to catch Facebook-related errors
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes('FB') || e.message.includes('facebook')) {
    console.log('Caught Facebook-related error:', e.message);
    return true; 
  }
});