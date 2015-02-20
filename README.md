# Oxford University contacts widget
Javascript widget to provide contact search functionality for Oxford University

The widget utilises the [Mobile Oxford Contact Search API](http://moxie-contacts.readthedocs.org/en/latest/)

### Dependencies
The widget makes use of jQuery to ensure maximum browser compatibility.
This can be included [via a CDN](https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js) or provided by your own server.

In order to work on IE8 and IE9, it's also necessary to include a [jQuery plugin](https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest) which enables cross-domain requests in IE.

### Using the widget
Include the widget scripts and dependencies in the page

Provide a container for the contact search e.g. `<div id='contact-search'></div>`

Insert a script to create the search widget:

    <script type="text/javascript">

        // define parameters for the widget
        var contact_search_params
        {
          el : $('#contact-search')
            //element in which to place the search widget

          url : "http://myAltURL.com/search?"
            //optionally override the url used for queries.
            //defaults to "https://api.m.ox.ac.uk/contact/search?"

          pageSize: 5,
            //optionally override the number of contact results shown per page
            //defaults to 10
        }

        //create the widget
        contact_search.create_form( contact_search_params );

    </script>

All contact results will then be retrieved via ajax and added to the container when the user submits the form.
All results are retreived at once, but are presented to the user in pages.

###Prefill results
Optionally, a search can be performed immediately when the widget is created. This is done by adding a `prefill` object to the parameters as follows:

    var contact_search_params
    {
      ...

      prefill: {
        lastname : "Smith",
        initial : "J",
        match : "approximate",    // 'exact' or 'approximate'. Defaults to 'exact'
        medium : "phone",         // 'phone' or 'email'. Defaults to 'email'
    }

###Styling
A sensible default styling is provided in 'contact_search.css'
This is created in scss via 'contact-search.scss'
