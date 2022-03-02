# how to setup

make sure you installed [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) as this is required for this bot to work.

after that install typescript for node

``npm install -g typescript``

after you installed typescript run ``yarn`` this will create a ``node_modules`` folder and install all the dependences **this is a required step**

once that is done you now have to create a new file and name it ``.env`` and inside type:

```
token="YourBotTokenHere"
prefix="!"
```

after you have created the file then run the command in a new command prompt:

``yarn run build``

once you have run the command run this command:

``yarn run start``

**now the bot should be running.**