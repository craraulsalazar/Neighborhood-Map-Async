#Neighborhood Map Project

Steps to run index.html

go to http://craraulsalazar.github.io/Neighborhood-Map-Async/index.html

##App Functionality

This application will be using foursquare API.

1. The application consists of a search field, a listview with my favorite places to visit in Toronto, a map on the right with markers in the locations, whenever you push/clicked, it will display an image from that location and more information about it from foursquare.

2. Search Bar: Filters both locations in the listview and in the map

3. Listview: Show locations that have been filter, additionally clicking/pushing the location button will activate it's associated marker and display a picture from foursquare

4. Map: Will display a marker of the specific location selected and will display information about it. Marker will be animated too for 3 seconds.

5. a toggle button is added at the top of the map whenever site is loaded in a mobile device, so users can see entire map or both.

6. Error handling. if fourquare api call is tampered and not loaded properly. an error message will be displayed. 
Responsive. The site is also responsive. tested with multiple Samsungs, Microsoft and Apple phones and tables.

7. note on Chrome device simulator testing.
   I tested in all devices and all markers show in the center. but sometimes the simulators don't fire the window.resize event and you have to refresh the browser. 
