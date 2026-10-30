# Spotlight — updated project

## Run locally
1. Extract this ZIP.
2. Open the `Spotlight` folder in VS Code.
3. Start Live Server from `index.html` (do not open pages using `file://`).
4. Use the homepage navigation to register, log in, open Account, and log out.

## Files
- `index.html` — public homepage and signed-in navigation
- `login.html` — Firebase email/password login and password reset
- `register.html` — artist/venue registration
- `artist-dashboard.html` — artist profile and edit form
- `venue-dashboard.html` — venue profile and edit form
- `style.css`, `auth.css`, `glitter.png` — design assets
- `script.js` — homepage Firebase session/navigation logic

## Firebase requirements
This project uses Firebase Authentication (Email/Password) and Cloud Firestore with project `spotlight-430c6`.
In Firebase Console:
1. Authentication → Sign-in method → enable Email/Password.
2. Firestore Database → Rules: review the existing rules before changing anything.
3. Use a real inbox for password reset; test-only addresses such as `test001@spotmail.com` cannot receive reset emails unless you own that inbox.

## Suggested Firestore rules
These rules let a signed-in user read/create/update only their own `/users/{uid}` profile, prevent changing their UID or account type after creation, and prevent client-side profile deletion. Review against any additional rules you already have before publishing.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null
                  && request.auth.uid == userId;

      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.uid == request.auth.uid
                    && request.resource.data.accountType in ['artist', 'venue'];

      allow update: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.uid == resource.data.uid
                    && request.resource.data.accountType == resource.data.accountType;

      allow delete: if false;
    }
  }
}
```

## Important notes
- Firebase web config is included in the client code, as expected for a Firebase web app. Security depends on Authentication and Firestore Rules, not on hiding this config.
- A successful login now returns to the homepage. The homepage shows an Account link and Log Out when signed in.
- Dashboard editing is hidden until Edit Profile is clicked.
- Artist/venue discovery is still a clearly marked placeholder; there is no real matching or messaging feature yet.
- Password reset requires a real email inbox and Firebase's email action settings to be configured.


LATEST UPDATE: Login now opens feed.html, a starter logged-in community feed. Artist and venue dashboards allow image URLs for profile pictures; venue dashboard also accepts a venue photo URL. Paste a direct image URL (not a Google search page URL). These URLs are saved in the user Firestore document. No Firebase Storage upload is used, so no Storage billing/setup is needed. Feed cards are clearly starter placeholders, not live listings.


LATEST DEMO UPDATE
- feed.html now loads registered artist and venue profiles from Firestore.
- Select a profile card to open its details in a modal.
- Your own card is marked YOUR PROFILE and includes an Edit your profile link.
- Registration now includes an optional short description, artist category or venue type, and optional image URL fields.
- Artist and venue dashboards allow these profile details to be edited.
- The app uses the same Firebase project configuration, so users logging in from another computer see the same cloud data.

TESTING
1. Extract the Spotlight folder.
2. Open the folder in VS Code.
3. Run index.html using Live Server.
4. Register/login with test accounts and open the feed.
5. Click a profile card to see its details.

IMAGE NOTES
- Image URL fields require a direct image URL that the browser can display. Local laptop file paths do not work for other users.
- Only use images you have permission to use, or images you created.

COLLABORATION / SECURITY
- A friend can test using a separate local copy and their own test account; both copies connect to the same Firebase cloud project.
- Do not share the Firebase console owner password. Share code through a ZIP or a private Git repository.
- Firestore rules must be reviewed before production. Publicly readable profile data should ideally be separated from private user account data.


NEW FEATURES (October 2026)
- feed.html: switch between All, Venues and Artists; search profiles by name, location, description or category.
- events.html: browse Upcoming, Live Now and All Events. Venue accounts can publish events with name, description, date, start/end time, location, category, poster URL, ticket details, and existing artist profiles as collaborators. Venue owners can cancel their own events.
- my-page.html: signed-in user public-facing profile page, with a link to edit the profile and event activity. Venue owners see events they host; artists see events they're listed on as collaborators.
- firestore.rules: proposed rules for signed-in profile discovery, event creation and owner-only event updates, plus groundwork for reviews and booking requests.

IMPORTANT FIREBASE SETUP
1. Open Firebase Console > Firestore Database > Rules for project spotlight-430c6.
2. Back up your existing rules first.
3. Review and paste the contents of firestore.rules, then Publish. Do not leave old restrictive rules in place if you want signed-in users to discover each other's profiles and events.
4. These rules allow signed-in users to read the /users documents. If those documents contain email addresses or other private information, move private fields to a separate protected collection before using this beyond a demo.
5. The reviews and bookingRequests rules are groundwork only; the review and booking-request user interfaces are not included in this update.
6. Run index.html with VS Code Live Server; do not use file:// URLs.

TEST CHECKLIST
- Log in as an artist: Explore filters/search, My Page, and event listings should be available; event creation is hidden.
- Log in as a venue: Events page shows Create an event; publish an event with a future date and selected artist profiles.
- Confirm it appears in Upcoming, and on the venue's My Page. Test Live Now by setting the event date/time to the current local time and an end time in the future.
- Check browser DevTools Console if a permission or network error appears.

LATEST UPDATE: EVENT DETAILS AND PERFORMANCE BOOKINGS
- Event cards are clickable and open a full event detail modal.
- Collaborating artist avatars are clickable and open the artist profile card.
- Venue accounts can publish open performance dates with time, category/artist type, and requirements.
- Artist accounts can request open dates; venue accounts can approve (which marks the slot booked) or decline.
- Venue owners can mark an open slot closed.
- IMPORTANT: this update adds the venueSlots collection and changes bookingRequests rules. Back up and publish the included firestore.rules in Firebase Console > Firestore Database > Rules before testing these new features.
- The site was syntax-checked locally; live Firebase behaviour still needs testing in the owner's project.
