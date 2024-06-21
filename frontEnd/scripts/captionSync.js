/**
 * File: captionSync.js
 * Type: JavaScript
 * Author: mathteixeira55
 * Description: Load a YouTube video and its captions, and display the captions
 * as the video plays.
 * Date: 2024-05-30
 * License: MIT
 * Version: 1.0
 */

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Listener executed when the DOM is fully loaded
   */

  // Elements references
  const video = document.getElementById("youtube-video");
  const transcriptionContainer = document.getElementById("transcription");

  // Paths
  const captionsFile =
    "./assets/WIN 20240530 19 53 23 Pro [pYkL-L9XW9E].en.vtt";

  // Other variables
  let captions = [];
  let captionInterval;
  let player;

  // -------------------- Loading captions into memory -------------------- //
  fetch(captionsFile)
    .then((response) => response.text())
    .then((data) => {
      captions = parseVTT(data);
    })
    .catch((error) => console.error("Error loading transcription:", error));

  function parseVTT(vtt) {
    /**
     * Parse a VTT file and return an array of caption objects
     * @param {string} vtt - The VTT file content
     * @returns {Array} An array of caption objects with start, end, and text properties
     */
    const captions = [];
    const lines = vtt.split("\n");
    let caption = null;

    // Parse each line of the VTT file
    lines.forEach((line) => {
      // Check if the line contains a time range
      const timeMatch = line.match(
        /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/
      );
      // If the line contains a time range, create a new caption object
      if (timeMatch) {
        if (caption) {
          captions.push(caption);
        }
        caption = {
          start: parseTime(timeMatch[1]),
          end: parseTime(timeMatch[2]),
          text: "",
        };
        // Else if the line is not empty and a caption object exists
      } else if (line.trim() && caption) {
        // Clean caption removing additional timestamps
        const cleanedLine = line.replace(/<[^>]+>/g, "").trim();
        // Add the cleaned line to the caption text
        caption.text += cleanedLine + "\n";
      }
    });
    if (caption) {
      captions.push(caption);
    }
    return captions;
  }

  function parseTime(timeString) {
    /**
     * Parse a time string in the format HH:MM:SS.SSS and return the time in seconds
     * @param {string} timeString - The time string to parse
     * @returns {number} The time in seconds
     */
    const [hours, minutes, seconds] = timeString.split(":");
    return (
      parseFloat(hours) * 3600 + parseFloat(minutes) * 60 + parseFloat(seconds)
    );
  }
  // ---------------- end Loading captions into memory -------------------- //

  // --------------------------- Load the video --------------------------- //
  //Load YouTube IFrame Player API, so we can use it to control  the video
  //(and get properties, such as: is it running?, what is the current time?)
  window.onYouTubeIframeAPIReady = function () {
    /**
     * Initialize the YouTube player when the API is ready
     * This function is called automatically by the YouTube IFrame Player API
     */
    player = new YT.Player("youtube-video", {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerReady(event) {
    /**
     * Start playing the video when the player is ready
     * @param {Object} event - The event object
     * This function is called automatically by the YouTube IFrame Player API
     * when the player is ready
     */
    // Get the iframe element
    var iframe = event.target.getIframe();
  }
  // ------------------------ end Load the video -------------------------- //

  // ------------ Synchronize the captions with the video ----------------- //
  function onPlayerStateChange(event) {
    /**
     * Update the captions when the video state changes
     * @param {Object} event - The event object
     * This function is called automatically by the YouTube IFrame Player API
     * when the player state changes
     */
    if (event.data == YT.PlayerState.PLAYING) {
      // Start updating captions when the video is playing
      captionInterval = setInterval(() => {
        const currentTime = player.getCurrentTime();
        updateCaption(currentTime);
      }, 100); // Update captions every 100ms
    } else {
      // Stop updating captions when the video is paused or stopped
      clearInterval(captionInterval);
    }
  }

  function updateCaption(currentTime) {
    /**
     * Update the transcription container with the caption corresponding to the current time
     * @param {number} currentTime - The current time of the video in seconds
     */

    // Find the index of the caption corresponding to the current time
    const currentCaptionIndex = captions.findIndex(
      (caption) => currentTime >= caption.start && currentTime <= caption.end
    );

    if (currentCaptionIndex !== -1) {
      // Pop the current caption
      const currentCaption = captions.splice(currentCaptionIndex, 1)[0];

      // Replace newlines with <br> tags for HTML
      transcriptionContainer.innerHTML = currentCaption.text
        .trim()
        .replace(/\n/g, "<br>");
    }
  }
  // -------- end synchronize the captions with the video ----------------- //
});
// ----------- end Listener executed when the DOM is fully loaded ----------- //
