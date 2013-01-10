# Introduction to the CommonJS Library

The library is self-contained under the Common# namespace.<br>
This library uses the ExtJS 4 (in sandboxed mode) as base framework to avoid to implement some features like: class management, json, dom, etc.


## Including the library in your page

You could use a different build file depending on your page contents.<br>
Use the core build if you only would like to use utility methods without UI.


### Including with ExtJS 4 self contained

    <link rel="stylesheet" type="text/css" href="resources/themes/default/common-all.css" />
    <script type="text/javascript" src="builds/common-all-debug.js"></script>
    <script type="text/javascript" src="locale/common-lang-en.js"></script>


### Including when ExtJS 4 is already in use

You must to map Ext to CommonExt.

    <link rel="stylesheet" type="text/css" href="resources/themes/default/common-all.css" />
    <script type="text/javascript"> CommonExt = Ext; </script>
    <script type="text/javascript" src="builds/common-all-without-ext4-debug.js"></script>
    <script type="text/javascript" src="locale/common-lang-en.js"></script>
