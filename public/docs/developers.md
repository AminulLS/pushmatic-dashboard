## Installing ServiceWorker

To enable push notification on your site you will need a service worker file on your site root directory called `service-worker.js`. Now, add the following script to load YOUR_APP_NAME's service worker.

```javascript
importScripts('https://YOUR_DOMAIN/api/v1/partner/sdk?id=YOUR_LIST_ID&type=sw');
```

Please ensure that the newly created file is loading like this: `https://example.com/service-worker.js` and make sure the file can be accessible over the internet by anyone.

## Installing SDK

In this step, you will need to include YOUR_APP_NAME's SDK on your site. Please add below code inside the `<head>` tag like below.

```html

<script src="https://YOUR_DOMAIN/api/v1/partner/sdk?id=YOUR_LIST_ID&type=sdk"></script>
<script>
    window.addEventListener('load', function () {
        const PMNotify = new PushMatic({
            list_id: 'YOUR_LIST_ID',
            resubscribe: false,
        });

        const profile = {
            first_name: 'Aminul',
            last_name: 'Islam',
            search: 'React',
            location: '10010',
            chnl1: "channel1",
            chnl2: "channel2",
            chnl3: "channel3",
        };

        // Prompt Style Available: style1, style2, and default.
        const style = 'style1'; // style1, style2, and default
        const config = {
            delay: 5, // in seconds
            i18n: {
                // this will used to replace messages.
                heading: 'Click "Allow" as shown below',
                content: 'to get job opportunities as they become available.',
                image: 'https://d2xhf521q3hl3o.cloudfront.net/img/allow-push.png',
                imageAlt: 'Allow Push',
                allow: 'OK ➤',
                cancel: 'No, Thanks',
            }
        };

        // Show the notification modal.
        PMNotify.prepare(profile).prompt(style, config);

        // To update profile
        // PMNotify.profileUpdate({
        //     first_name: 'Aminul',
        //     last_name: 'Islam',
        // }).then(() => console.log('Profile updated'));


        // To get profile
        // PMNotify.getProfile().then(profile => console.log(profile));

        // To unsubscribe
        // const reason = 'Too many notifications.'
        // PMNotify.unsubscribe(reason).then(() => console.log('Unsubscribed'));
    });
</script>
```
