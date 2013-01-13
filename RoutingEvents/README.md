Routing Events
================

The routing implementation for angular is robust, but for smaller application can be overkill.  To simplify the process in smaller projects Routing Events brings routing events dirrectly to the controller.  Importing the RoutingEvent module enable injecting the reRouter object into a controller.

	Important note: Currently, the RoutingEvents module utilize a dummy <ng-view></ng-view> section, and renders a hidden div to the area, future work on this module will look into removing this dependency.






example: [sample.html](https://github.com/SergeiGolos/Angular/blob/master/RoutingEvents/sample.html);

