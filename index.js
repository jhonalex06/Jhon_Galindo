function filterSelection(tag) {
    var card, cards, index, alreadyHidden;
    cards = document.getElementsByClassName("card-experience");

    for (index = 0; index < cards.length; index++) {
        card = cards[index];
        alreadyHidden = card.classList.contains("d-none");

        if ((tag == "card-all") || (card.classList.contains(tag))) {
            if (alreadyHidden) {
                card.classList.remove("d-none");
            };
        } else {
            if (!alreadyHidden) {
                card.classList.add("d-none");
            };
        };
    };
};

let requestURL = "./profile.json";
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function () {
    const data = request.response;

    // Description
    var oc_description_text, oc_description;
    oc_description = document.querySelector('#output_description');
    oc_description_text = document.createElement("p");
    oc_description_text.innerHTML = "I am passionate about developing software in Python, principally related to the geographic field. I am a Cadastral Engineer and Geodesist, a student in Master of Science in Information and Communications with emphasis on Geomatics.";
    oc_description.appendChild(oc_description_text);

    // Skills
    oc_skills = document.getElementById('output_skills');
    var skills_plot_data = [{
        type: "sunburst",
        labels: ["Jhon G", 
                "Data Bases", "PostgreSQL", "Geopackage", "Mongo DB",
                "GIS", "QGIS - ArcGIS", "GeoServer", "QField", "GeoPandas", 
                "Software Development", "Python", "Django", "Javascript", "CSS", "HTML", "AWS", "GIT",
                "Operating Systems", "Linux", "Windows",
                "Image Manipulation", "GIMP", "Photoshop", "InkScape"],
        parents: ["", 
                  "Jhon G", "Data Bases", "Data Bases", "Data Bases", 
                  "Jhon G", "GIS", "GIS", "GIS", "GIS", 
                  "Jhon G", "Software Development", "Software Development", "Software Development", "Software Development", "Software Development", "Software Development", "Software Development",
                  "Jhon G", "Operating Systems", "Operating Systems",
                  "Jhon G", "Image Manipulation", "Image Manipulation", "Image Manipulation"],
        values: [0, 
                 0, 8, 5, 2,
                 0, 9, 3, 7, 6, 
                 0, 12, 5, 6, 6, 6, 2, 3,
                 0, 5, 5,
                 0, 5, 3, 2,],
        outsidetextfont: { size: 20, color: "#377eb8" },
        insidetextfont: { size: 10, color: "#ffffff" },
        leaf: { opacity: 0.4 },
        marker: { line: { width: 2 } },
    }];

    var skills_plot_layout = {
        margin: { l: 0, r: 0, b: 0, t: 0 },
        hovermode: false,
    };

    var skills_plot_config = {
        responsive: true,
        modeBarButtonsToRemove: [
            "toImage", 
            "toggleHover"
        ]
    };

    Plotly.newPlot(oc_skills, skills_plot_data, skills_plot_layout, skills_plot_config);

    // Location
    oc_location = document.getElementById('output_location');

    var location_plot_data = [{
        type: 'scattermapbox',
        lat: ['43.47918'],
        lon: ['-80.51685'],
        mode: 'markers',
        marker: {
            size: 14,
            color: 'red',
        },
        text: ['Toronto'],
        textposition: "bottom right"
    }];

    var location_plot_layout = {
        autosize: true,
        hovermode: 'closest',
        mapbox: { style: "open-street-map", center: { lat: 43.4793, lon: -80.5206 }, zoom: 11 },
        margin: { r: 0, t: 50, b: 0, l: 0 },
        title: {
            text: 'Waterloo, Ontario, Canada',
        }
    };

    var location_plot_config = {
        responsive: true,
        modeBarButtonsToRemove: [
            "toImage",
            "select2d",
            "lasso2d",
            "toggleHover"
        ]
    };

    Plotly.newPlot(oc_location, location_plot_data, location_plot_layout, location_plot_config);

    // Education
    data['education'].forEach(rowItems => {
        var table, row, rowCell, rowCellItem;
        table = document.querySelector("#education_table_rows");
        row = document.createElement("tr");

        row.innerHTML = `
        <th scope="row">${rowItems["index"]}</th>
        <td scope="row">${rowItems["subject"]}</td>
        <td scope="row">${rowItems["degree"]}</td>
        <td scope="row">${rowItems["school"]}</td>
        <td scope="row">${rowItems["year"]}</td>
        `;

        table.appendChild(row);
    });

    // Contacts
    data['contacts'].forEach(rowItems => {
        var table, row;
        table = document.querySelector("#contacts_table_rows");
        row = document.createElement("tr");

        row.innerHTML = `
        <th scope="row">${rowItems["index"]}</th>
        <td><a href="${rowItems["href"]}" target="_blank"><i class="${rowItems["fab-class"]}"></i></a></td>
        <td><a href="${rowItems["href"]}" target="_blank" class="text-break">${rowItems["text"]}</a></td>
        `;

        table.appendChild(row);
    });

    // Experiences
    //// Tags
    data['experiences']['tags'].forEach(rowItems => {
        var label = document.createElement("label");
        label.setAttribute("class", "btn btn-outline-primary border-0 mb-2");

        var checkedState = '';
        if (rowItems['tag'] == "card-highlights") {
            label.classList.add("active");
            checkedState = 'checked';
        }

        label.innerHTML = `
        <input id="${"filter_" + rowItems["text"]}" 
               type="radio"
               name="options"
               onclick="filterSelection('${rowItems["tag"]}')"
        ${checkedState}>${rowItems["text"]}`;

        document.getElementById("experience_filters").appendChild(label);
    });

    //// Cards
    data['experiences']['cards'].forEach(rowItems => {
        var img = ``;
        if (rowItems["img"] != "") {
            img = `<img src="${rowItems["img"]}" class="card-img-top" alt="">`;
        };

        var url = ``;
        if (rowItems["url"] != "") {
            url = `<a href="${rowItems["url"]}" target="_blank" class="card-link"><i class="fas fa-external-link-alt"></i></a>`;
        };

        var card = document.createElement("div");
        card.setAttribute("class", "card card-experience " + rowItems["tags"]);

        if (!(card.classList.contains('card-highlights'))) {
            card.classList.add('d-none');
        }

        card.innerHTML = `
        ${img}
        <div class="card-body">
            <h5 class="card-title">${rowItems["title"]}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${rowItems["subtitle"]}</h6>
            <p class="card-text">${rowItems["body"]}</p>
        </div>
        <div class="card-footer text-right">
            <small class="text-muted">${rowItems["date"]} | ${rowItems["location"]}</small>
            ${url}
        </div>`;

        if (rowItems["title"] != "") {
            document.getElementById("experience-cards").appendChild(card);
        };
    });
};