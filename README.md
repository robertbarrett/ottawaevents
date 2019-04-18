# ottawaevents

ottawaevents.gs is a google app engine script that i call by browsing to

https://script.google.com/macros/s/AKfycbwKJjZHPcFiHjtjprV87Th_RG-LXLGbnLkiynPGjOY/dev

It takes the data from the google spreadsheet that the form fills, and turns it into a reddit thread.

I just copy/paste that into a reddit thread..... after a little bit of manual checking, to make sure spammers/shitposters didn't include any nonsense

Other than posting, the only manual interaction is, I reorder the spreadsheet by timestamp of the event (since the script doesn't order them), and I break the table between Sunday and Monday to make a second table for the weeks events. I want to update the .gs script so this manual interaction isn't required... at some point.

ottawaevents.py is a messaging bot (/u/sergeantalpowellsbot). It runs on a vps in a while loop, with the output catching all the errors I need to catch properly at some point... mostly just 

prawcore.exceptions.RequestException: error with request HTTPSConnectionPool(host='oauth.reddit.com', port=443): Read timed out. (read timeout=16.0)

I've noticed a bug where someone can subscribe twice, which the script should catch.

There's defintiely improvements to be made to both, but they work well enough that I haven't looked at them in too much detail
