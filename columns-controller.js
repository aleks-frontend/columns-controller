function columnsController() {
    const pageWrappers = document.querySelectorAll('[data-cc-hook="page-wrapper"]');
  
    for ( const pageWrapper of pageWrappers ) {
      const dataContainer = pageWrapper.querySelector('[data-cc-hook="data"]');
      const pagesData = getData(dataContainer);    
  
      dataContainer.style.cssText = `
          position: absolute;
          height: 200px; 
          overflow: hidden;
          opacity: 0;`;
  
      pagesData.forEach((pageData, index) => {
        if ( index === 0 ) {
          const speakersContainer = generatePage(pageWrapper);
          maxColumnsCheck(speakersContainer, pageData);
  
          for ( const [index, speakerData] of pageData.entries() ) {                    
            const speakerHTML = renderSpeaker(speakerData.data);
  
            if ( speakerData.newColumnStart || index === 0 ) {
              generateSpeakerColumn(speakersContainer);
            } 
  
            const lastColumn = speakersContainer.querySelector('.speaker__column:last-child');
            lastColumn.innerHTML += speakerHTML;
          }
        } else {
          const speakersContainer = generatePage(pageWrapper);
          maxColumnsCheck(speakersContainer, pageData);
  
          for ( const [index, speakerData] of pageData.entries() ) {                    
            const speakerHTML = renderSpeaker(speakerData.data);
  
            if ( speakerData.newColumnStart || index === 0 ) {
              generateSpeakerColumn(speakersContainer);
            } 
  
            const lastColumn = speakersContainer.querySelector('.speaker__column:last-child');
            lastColumn.innerHTML += speakerHTML;
          }        
        }
      });
    }
  }
  
  function getData(container) {
    const blocks = [...container.querySelectorAll('[data-cc-block-type]')]
    const dataStructure = blocks.map(block => {
      if ( block.dataset.ccBlockType === 'column-break' ) {
        return {
          type: block.dataset.ccBlockType
        }
      } else {
        return {
          type: block.dataset.ccBlockType,
          data: {
            name: block.querySelector('[data-dc-data-type="name"]').innerText || '',
            title: block.querySelector('[data-dc-data-type="title"]') ? block.querySelector('[data-dc-data-type="title"]').innerText : '',
            capitalText: block.querySelector('[data-dc-data-type="capital-text"]') || 'uppercase',
            image: block.querySelector('[data-dc-data-type="image"]').innerHTML || '',
            content: block.querySelector('[data-dc-data-type="content"]').innerText || '',            
          }
        }
      }      
    });
  
    const items = dataStructure.filter((item, index) => {
      if ( item.type === 'column-break' ) {
        if ( dataStructure[index + 1] ) {
          dataStructure[index + 1].newColumnStart = true;
        }
      } else if ( item.type === 'item') {
        return true;
      }
    });    
  
    const pages = [];
    for ( const [index, item] of items.entries() ) {
      if ( index === 0 ) {
        pages.push([item]);
      } else if ( index % 6 === 0 ) {
        pages.push([item]);
      } else {
        pages[pages.length -1].push(item);
      }
    }
  
    console.log(pages);
    return pages;
  }
  
  function renderPages() {
  
  }
  // Render Helper Functions
  function renderSpeaker(speakerData) {
    const { name, title, capitalText, image, content } = speakerData;
    return `
  <div class="speaker" data-max-height="280">
  <div class="speaker__image">
  <div class="reposition-fix">${image}</div><!--reposition-fix-->
  </div><!--speaker__image-->
  <div class="speaker__content">
  <div class="speaker__name  data-max-line="3">${name}</div><!--speaker__name-->
  <div class="speaker__title" data-max-line="3"><strong>${title}</strong></div><!--speaker__title-->
  <div class="speaker__copy">${content}</div><!--speaker__copy-->
  </div><!--speaker__content-->
  </div><!--speaker-->
  `;
  }
  
  function generatePage(wrapper) {
    const page = document.createElement('div');
    page.classList.add('page');
    wrapper.appendChild(page);
    const bleed = document.createElement('div');
    bleed.classList.add('bleed');
    page.appendChild(bleed);
  
    const fit = document.createElement('div');
    fit.classList.add('container', 'fit', 'fit--speakerPage');
    bleed.appendChild(fit);
  
    const body = document.createElement('div');
    body.classList.add('body');
    fit.appendChild(body);
  
    const content = document.createElement('div');
    content.classList.add('content');
    body.appendChild(content);
  
    const footer = document.createElement('div');
    footer.classList.add('footer');
    footer.innerHTML = `
  <div class="footer__text" data-target="footer-text"></div><!--footer__text-->
  <div class="website" data-target="website"></div><!--website-->
  `;
    fit.appendChild(footer);
  
    return generateSpeakerContainer(content);   
  }
  
  function generateSpeakerColumn(container) {  
    const speakersColumn = document.createElement('div');
    speakersColumn.classList.add('speaker__column');
    container.appendChild(speakersColumn);
  
    return speakersColumn;
  }
  
  function generateSpeakerContainer(container) {
    const speakersContainer = document.createElement('div');
    speakersContainer.classList.add('speaker__container');
    container.appendChild(speakersContainer);  
  
    return speakersContainer;
  }
  
  // Helper function for checking the maximum number of columns
  function maxColumnsCheck(container, speakersData) {
    let totalColumnBreaks = 0;
  
    speakersData.forEach(speaker => {
      if ( speaker.newColumnStart ) {
        totalColumnBreaks++;
      }
    });
  
    if ( totalColumnBreaks > 1 ) container.classList.add('columns-controller-error');
  }
  
  columnsController();
  