var contact_search =
{

    create_form : function (params) {
        this.el = params.el;
        this.prefill = params.prefill;
        this.url = params.url? params.url : 'http://api.m.ox.ac.uk/contact/search?';

        var $form_container = $("<div class='contactsearch'></div>");
        $form_container.append('<h2>Contact search</h2>');
        var $form = $("<form id='contact_form' method='get'></form>");
        var $name_details_container = $("<div class='form-item name-details'></div>");

        var $lastname_container = $("<div class='lastname-container'></div>");
        $lastname_container.append($("<label for='lastname' class='required'>Surname</label>"));
        $lastname_container.append($("<input class='full' type='text' name='lastname' id='lastname' placeholder='E.g. Smith' value=''>"));

        var $initial_container = $("<div class='initial-container'></div>");
        $initial_container.append($("<label for'initial' class='optional'>Initial</label>"));
        $initial_container.append($("<input class='full' type='text' name='initial' id='initial' placeholder='E.g. J' value=''>"));

        $name_details_container.append($lastname_container).append($initial_container);

        var $search_specifics = $("<div class='form-item search-specifics'></div>");
        var $exact1_radio = $("<label for='exact1' class='radio'>Exact</label>");
        $exact1_radio.prepend($("<input type='radio' name='exact' class='radio' value='true' id='exact1' checked='checked'>"));

        var $exact2_radio = $("<label for='exact2' class='radio_second'>Approximate</label>");
        $exact2_radio.prepend($("<input type='radio' name='exact' class='radio' value='false' id='exact2'>"));
        $search_specifics.append($exact1_radio).append($exact2_radio);

        var $submit_buttons = $("<div class='form-item'></div>");
        var $emailButton = $("<input type='submit' name='find_email' alt='Find email address' value='Email'>");
        $emailButton.data('medium', 'email');
        var $phoneButton = $("<input type='submit' name='find_phone' alt='Find telephone nubmers' value='Phone'>");
        $phoneButton.data('medium', 'phone');
        $submit_buttons.append($emailButton).append($phoneButton);


        var $emergency = $('<div class="emergency-nums"></div>');
        var $emergency_link = $('<a href="http://www.admin.ox.ac.uk/ouss/contactus/" name="emergency_numbers" title="Emergency numbers" id="emergency_numbers">');
        $emergency_link.append($('<span class="exclamation"></span>Emergency numbers</a>'));
        $emergency.append($emergency_link);

        $form.append($name_details_container).append($search_specifics).append($submit_buttons).append($emergency);
        $form_container.append($form);

        this.el.append($form_container);

        this.bind_events();
    },
    bind_events : function () {
        //record which button was clicked on submit button click
        $( 'input[type=submit]' , $('#contact_form')).click( function() {
            //Add a data attribute to the form based on the clicked button
            var medium = $(this).val();
            $(this).parents('form').data('medium', $(this).data('medium'));
        })

        //form submit
        $('#contact_form').submit(function(ev) {
           ev.preventDefault();
            //extract values from the form to build our query
            var lastname = $('input#lastname', $(ev.target)).val();
            var initial = $('input#initial', $(ev.target)).val();
            var exact = $('input#exact1').is(':checked');
            var medium = $(ev.target).data('medium');

            //do the query
            var nameTerm = "q=" + initial + "%20" + lastname;
            var mediumTerm = "medium=" + medium;
            var exactTerm = exact=='exact' ? "exact=true" : "exact=false";

            var query = nameTerm + "&" + mediumTerm + "&" + exactTerm;
            var url = this.url + query;

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                success: this.displayResults.bind(this),
                failure: function(response) {
                    console.error("Failed to retrieve contact results");
                }
            });

            console.log(query);
        }.bind(this));

    },
    displayResults : function(response) {
        //create results div if it doesn't already exist
        var $results = $('.contact-results', this.el);
        if($results.length <= 0) {
            var $results = $("<div class='contact-results'></div>");
            //add the list to the widget
            this.el.append($results);
        }
        else {
            $results.empty();
        }
        $results.append($("<h2>Results</h2>"));
        $results.append($("<p>Found " + response.persons.length + " entries</p>"));
        var $list = $("<ul></ul>");
        $results.append($list);


        //populate table
        for(var i=0; i<response.persons.length; i++) {

            var person = response.persons[i];
            var $entry = $("<li id='person_" + (i+1) + "'></li>");

            $list.append($entry);
            //name
            var $name = $("<div id='name-" + (i+1) + "' class='person_name'></div>");
            $name.append($("<h3>" + person.name + "<h3>"));
            $entry.append($name);
            //unit
            var $unit = $("<div id='unit-" + (i+1) + "' class='person_unit'></div>");
            $unit.text(person.unit);
            $entry.append($unit);
            //email
            if(person.email) {
                var $email = $("<div id='email-" + (i+1) + "' class='person_email'></div>");
                $email.append($("<a href='mailto:" + person.email + "'>" + person.email + "</a>"));
                $entry.append($email);
            }
            //phone
            if(person.external_tel || person.internal_tel) {
                var $phone = $("<div id='phone-" + (i+1) + "' class='person_phone'></div>");
                var $phone_list = $("<dl></dl>");
                $phone.append($phone_list);
                if(person.internal_tel) {
                    $phone_list.append($("<dt>Internal</dt><dd>" + person.internal_tel + "</dd>"));
                }
                if(person.external_tel) {
                    $phone_list.append($("<dt>External</dt><dd>" + person.external_tel + "</dd>"));
                }
                $entry.append($phone);
            }

        }


    }

};


