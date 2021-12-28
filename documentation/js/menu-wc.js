'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">sigma2-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AforosModule.html" data-type="entity-link" >AforosModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AforosModule-6eba74bbf7e19a55fb99587f0cd5be4edd87eedb6a7acde0cebe4401db2b0daa9a4e9ea88b5a970ffa6cf8640f5357bbc1b4c6d6430d10bd2ac51f3667b0485b"' : 'data-target="#xs-components-links-module-AforosModule-6eba74bbf7e19a55fb99587f0cd5be4edd87eedb6a7acde0cebe4401db2b0daa9a4e9ea88b5a970ffa6cf8640f5357bbc1b4c6d6430d10bd2ac51f3667b0485b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AforosModule-6eba74bbf7e19a55fb99587f0cd5be4edd87eedb6a7acde0cebe4401db2b0daa9a4e9ea88b5a970ffa6cf8640f5357bbc1b4c6d6430d10bd2ac51f3667b0485b"' :
                                            'id="xs-components-links-module-AforosModule-6eba74bbf7e19a55fb99587f0cd5be4edd87eedb6a7acde0cebe4401db2b0daa9a4e9ea88b5a970ffa6cf8640f5357bbc1b4c6d6430d10bd2ac51f3667b0485b"' }>
                                            <li class="link">
                                                <a href="components/AforosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AforosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AnalisisTransitoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AnalisisTransitoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaAforosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaAforosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapaSeleccionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapaSeleccionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroAforosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroAforosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroDatosAforoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroDatosAforoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AforosRoutingModule.html" data-type="entity-link" >AforosRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AlcaldiasModule.html" data-type="entity-link" >AlcaldiasModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AlcaldiasModule-7b8b07ef6deb3c498eba123663e912e9aca8f190bae6e1168cbc06eaf3e55f4fd2040f0777265d29f69bd9b5e28dfa7f400842153bb4d9037c0a5aa6a1325dda"' : 'data-target="#xs-components-links-module-AlcaldiasModule-7b8b07ef6deb3c498eba123663e912e9aca8f190bae6e1168cbc06eaf3e55f4fd2040f0777265d29f69bd9b5e28dfa7f400842153bb4d9037c0a5aa6a1325dda"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AlcaldiasModule-7b8b07ef6deb3c498eba123663e912e9aca8f190bae6e1168cbc06eaf3e55f4fd2040f0777265d29f69bd9b5e28dfa7f400842153bb4d9037c0a5aa6a1325dda"' :
                                            'id="xs-components-links-module-AlcaldiasModule-7b8b07ef6deb3c498eba123663e912e9aca8f190bae6e1168cbc06eaf3e55f4fd2040f0777265d29f69bd9b5e28dfa7f400842153bb4d9037c0a5aa6a1325dda"' }>
                                            <li class="link">
                                                <a href="components/AlcaldiasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AlcaldiasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CambioContraseniaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CambioContraseniaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AlcaldiasRoutingModule.html" data-type="entity-link" >AlcaldiasRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ApiquesAforosModule.html" data-type="entity-link" >ApiquesAforosModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ApiquesAforosModule-14b3f31bf9cdd3108bbac791b7ef26e0e82d26cf86b1cd6a53870e96c28f128728c452f5ba033b53c7e40b1d1e1976355672198f965cafad2a5f730020c83531"' : 'data-target="#xs-components-links-module-ApiquesAforosModule-14b3f31bf9cdd3108bbac791b7ef26e0e82d26cf86b1cd6a53870e96c28f128728c452f5ba033b53c7e40b1d1e1976355672198f965cafad2a5f730020c83531"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ApiquesAforosModule-14b3f31bf9cdd3108bbac791b7ef26e0e82d26cf86b1cd6a53870e96c28f128728c452f5ba033b53c7e40b1d1e1976355672198f965cafad2a5f730020c83531"' :
                                            'id="xs-components-links-module-ApiquesAforosModule-14b3f31bf9cdd3108bbac791b7ef26e0e82d26cf86b1cd6a53870e96c28f128728c452f5ba033b53c7e40b1d1e1976355672198f965cafad2a5f730020c83531"' }>
                                            <li class="link">
                                                <a href="components/ApiquesAforosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiquesAforosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsociarAforosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsociarAforosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RealizarSolicitudesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RealizarSolicitudesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitudDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SolicitudDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitudesApiquesAforosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SolicitudesApiquesAforosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablaPendientesApiquesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablaPendientesApiquesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ApiquesAforosRoutingModule.html" data-type="entity-link" >ApiquesAforosRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' : 'data-target="#xs-components-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' :
                                            'id="xs-components-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EnEsperaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EnEsperaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MenuItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotAuthorizedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotAuthorizedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotFoundComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RevisionVisitaDiagnosticoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RevisionVisitaDiagnosticoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SimpleDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SimpleDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WelcomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WelcomeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' : 'data-target="#xs-injectables-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' :
                                        'id="xs-injectables-links-module-AppModule-485690c6d85a3bed056aeb0680eb946ea9c0dcab22ca084933bc4ef6d723814f4fb9292d84a4be873cbc895ed6e213a7e441e3ab0f733dbb8266a43eda3ecfa7"' }>
                                        <li class="link">
                                            <a href="injectables/SecurityService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SecurityService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AsignarVisitaModule.html" data-type="entity-link" >AsignarVisitaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AsignarVisitaModule-7aad6bf00266b9122d6027205d6ebe126dd48cf7ffd8e9d273d54d8854a90e9dc3ca97f49a038fdd1d55db14214f09e92424c52a9d0dd23c8a42ca651579dd03"' : 'data-target="#xs-components-links-module-AsignarVisitaModule-7aad6bf00266b9122d6027205d6ebe126dd48cf7ffd8e9d273d54d8854a90e9dc3ca97f49a038fdd1d55db14214f09e92424c52a9d0dd23c8a42ca651579dd03"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AsignarVisitaModule-7aad6bf00266b9122d6027205d6ebe126dd48cf7ffd8e9d273d54d8854a90e9dc3ca97f49a038fdd1d55db14214f09e92424c52a9d0dd23c8a42ca651579dd03"' :
                                            'id="xs-components-links-module-AsignarVisitaModule-7aad6bf00266b9122d6027205d6ebe126dd48cf7ffd8e9d273d54d8854a90e9dc3ca97f49a038fdd1d55db14214f09e92424c52a9d0dd23c8a42ca651579dd03"' }>
                                            <li class="link">
                                                <a href="components/AgendaVisitasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AgendaVisitasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsignarRecursoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsignarRecursoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsignarVisitasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsignarVisitasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogVerVisitaDiseno.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogVerVisitaDiseno</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerGrupoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerGrupoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AsignarVisitaRoutingModule.html" data-type="entity-link" >AsignarVisitaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CargueResultadoEnsayoModule.html" data-type="entity-link" >CargueResultadoEnsayoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CargueResultadoEnsayoModule-c6ff5be623150a68a2d42418e4e6aaa0a632d9c4d24f321f8df08fd492915e9f217782d68a2d7bb6080479cc0383d8a4b409626058eb0679289a92f0157074e7"' : 'data-target="#xs-components-links-module-CargueResultadoEnsayoModule-c6ff5be623150a68a2d42418e4e6aaa0a632d9c4d24f321f8df08fd492915e9f217782d68a2d7bb6080479cc0383d8a4b409626058eb0679289a92f0157074e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CargueResultadoEnsayoModule-c6ff5be623150a68a2d42418e4e6aaa0a632d9c4d24f321f8df08fd492915e9f217782d68a2d7bb6080479cc0383d8a4b409626058eb0679289a92f0157074e7"' :
                                            'id="xs-components-links-module-CargueResultadoEnsayoModule-c6ff5be623150a68a2d42418e4e6aaa0a632d9c4d24f321f8df08fd492915e9f217782d68a2d7bb6080479cc0383d8a4b409626058eb0679289a92f0157074e7"' }>
                                            <li class="link">
                                                <a href="components/GestionSolicitudComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionSolicitudComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InformeSolicitudComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InformeSolicitudComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalCargueArchivoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalCargueArchivoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalConfirmarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalConfirmarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalDescargaArchivoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalDescargaArchivoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalVersionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalVersionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResultadoEnsayoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ResultadoEnsayoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableEnsayoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableEnsayoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableInformeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableInformeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableVersionSolicitudComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableVersionSolicitudComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabsDistribuidorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabsDistribuidorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CargueResultadoEnsayoRoutingModule.html" data-type="entity-link" >CargueResultadoEnsayoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CarguesMejoramientoModule.html" data-type="entity-link" >CarguesMejoramientoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CarguesMejoramientoModule-c479dedc957b4e46f23bfaa6ce7e9489f2305eb0d02cd3b37b99cea2ee544d1930ebc119c771dfc5c53145ef4ddff23f3d1a6ca0c4b19f7b53b54d790a87d057"' : 'data-target="#xs-components-links-module-CarguesMejoramientoModule-c479dedc957b4e46f23bfaa6ce7e9489f2305eb0d02cd3b37b99cea2ee544d1930ebc119c771dfc5c53145ef4ddff23f3d1a6ca0c4b19f7b53b54d790a87d057"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CarguesMejoramientoModule-c479dedc957b4e46f23bfaa6ce7e9489f2305eb0d02cd3b37b99cea2ee544d1930ebc119c771dfc5c53145ef4ddff23f3d1a6ca0c4b19f7b53b54d790a87d057"' :
                                            'id="xs-components-links-module-CarguesMejoramientoModule-c479dedc957b4e46f23bfaa6ce7e9489f2305eb0d02cd3b37b99cea2ee544d1930ebc119c771dfc5c53145ef4ddff23f3d1a6ca0c4b19f7b53b54d790a87d057"' }>
                                            <li class="link">
                                                <a href="components/CarguesMejoramientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CarguesMejoramientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgramacionVisitaTecnicaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgramacionVisitaTecnicaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SincroniacionSPIComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SincroniacionSPIComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CarguesMejoramientoRoutingModule.html" data-type="entity-link" >CarguesMejoramientoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ConsultasMejoramientoModule.html" data-type="entity-link" >ConsultasMejoramientoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ConsultasMejoramientoModule-8ae50adb1bf1b7b0a0f0964e45bd818d64c4df3244baf5708d324079a475f7c5e08ab9b1309914991367c4f3b9e0ad6c3efdd16a79a767fad2a8d8e6cadfea2b"' : 'data-target="#xs-components-links-module-ConsultasMejoramientoModule-8ae50adb1bf1b7b0a0f0964e45bd818d64c4df3244baf5708d324079a475f7c5e08ab9b1309914991367c4f3b9e0ad6c3efdd16a79a767fad2a8d8e6cadfea2b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConsultasMejoramientoModule-8ae50adb1bf1b7b0a0f0964e45bd818d64c4df3244baf5708d324079a475f7c5e08ab9b1309914991367c4f3b9e0ad6c3efdd16a79a767fad2a8d8e6cadfea2b"' :
                                            'id="xs-components-links-module-ConsultasMejoramientoModule-8ae50adb1bf1b7b0a0f0964e45bd818d64c4df3244baf5708d324079a475f7c5e08ab9b1309914991367c4f3b9e0ad6c3efdd16a79a767fad2a8d8e6cadfea2b"' }>
                                            <li class="link">
                                                <a href="components/ConsultaGeneralGestionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaGeneralGestionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultaHistorialComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaHistorialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultasMejoramientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultasMejoramientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerDetalleMantenimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerDetalleMantenimientoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConsultasMejoramientoRoutingModule.html" data-type="entity-link" >ConsultasMejoramientoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentosMantenimientoVialModule.html" data-type="entity-link" >DocumentosMantenimientoVialModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' : 'data-target="#xs-components-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' :
                                            'id="xs-components-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' }>
                                            <li class="link">
                                                <a href="components/CargueDocumentosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CargueDocumentosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetalleDocumentosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DetalleDocumentosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DropZoneDocumentosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DropZoneDocumentosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalConfirmarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalConfirmarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgressComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableDocumentosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableDocumentosComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' : 'data-target="#xs-directives-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' :
                                        'id="xs-directives-links-module-DocumentosMantenimientoVialModule-a207562f22a55390a0898c5e671333456d417255544a82375fc3e7c4d9baf222be5a033347df8ee6c8b13ed1adfd1156b2f671da01d0acb84ac90322d4cc1994"' }>
                                        <li class="link">
                                            <a href="directives/DndDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DndDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DocumentosMantenimientoVialRoutingModule.html" data-type="entity-link" >DocumentosMantenimientoVialRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EquipoModule.html" data-type="entity-link" >EquipoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EquipoModule-215c26d16411c97d4315d997c2967dd903e73e89326adb50c7e79d18f96ed5458055bc88cefbe01d9307ed1a56d75e556b80b72b56489402c0be135ec6197e19"' : 'data-target="#xs-components-links-module-EquipoModule-215c26d16411c97d4315d997c2967dd903e73e89326adb50c7e79d18f96ed5458055bc88cefbe01d9307ed1a56d75e556b80b72b56489402c0be135ec6197e19"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EquipoModule-215c26d16411c97d4315d997c2967dd903e73e89326adb50c7e79d18f96ed5458055bc88cefbe01d9307ed1a56d75e556b80b72b56489402c0be135ec6197e19"' :
                                            'id="xs-components-links-module-EquipoModule-215c26d16411c97d4315d997c2967dd903e73e89326adb50c7e79d18f96ed5458055bc88cefbe01d9307ed1a56d75e556b80b72b56489402c0be135ec6197e19"' }>
                                            <li class="link">
                                                <a href="components/ActualizarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActualizarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EliminarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EliminarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InsertarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsertarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EquipoRoutingModule.html" data-type="entity-link" >EquipoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GestionMisionalidadModule.html" data-type="entity-link" >GestionMisionalidadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GestionMisionalidadModule-d9a9811583e320f3722ac293e7be71febe5c8932bb16fe897325f5b6d92a1de9ecd49a68a518c0ed534098277f031d1e273f90d202bfbd660b5cbb858be60756"' : 'data-target="#xs-components-links-module-GestionMisionalidadModule-d9a9811583e320f3722ac293e7be71febe5c8932bb16fe897325f5b6d92a1de9ecd49a68a518c0ed534098277f031d1e273f90d202bfbd660b5cbb858be60756"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GestionMisionalidadModule-d9a9811583e320f3722ac293e7be71febe5c8932bb16fe897325f5b6d92a1de9ecd49a68a518c0ed534098277f031d1e273f90d202bfbd660b5cbb858be60756"' :
                                            'id="xs-components-links-module-GestionMisionalidadModule-d9a9811583e320f3722ac293e7be71febe5c8932bb16fe897325f5b6d92a1de9ecd49a68a518c0ed534098277f031d1e273f90d202bfbd660b5cbb858be60756"' }>
                                            <li class="link">
                                                <a href="components/DialogVerVisitaDiagnostico.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogVerVisitaDiagnostico</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogVerVisitaDisenioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogVerVisitaDisenioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionMisionalidadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionMisionalidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionarMisionalidadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionarMisionalidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionarSeguimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionarSeguimientoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GestionMisionalidadRoutingModule.html" data-type="entity-link" >GestionMisionalidadRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GestionReservaModule.html" data-type="entity-link" >GestionReservaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GestionReservaModule-4b6394de9ff0874e7572914f7a315bc0e5a058d7a907d3669779b2dd8b7df31118608ddbd6980f43ca41b2ec391c814fe1196920a0700c00acb213c01bf6c685"' : 'data-target="#xs-components-links-module-GestionReservaModule-4b6394de9ff0874e7572914f7a315bc0e5a058d7a907d3669779b2dd8b7df31118608ddbd6980f43ca41b2ec391c814fe1196920a0700c00acb213c01bf6c685"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GestionReservaModule-4b6394de9ff0874e7572914f7a315bc0e5a058d7a907d3669779b2dd8b7df31118608ddbd6980f43ca41b2ec391c814fe1196920a0700c00acb213c01bf6c685"' :
                                            'id="xs-components-links-module-GestionReservaModule-4b6394de9ff0874e7572914f7a315bc0e5a058d7a907d3669779b2dd8b7df31118608ddbd6980f43ca41b2ec391c814fe1196920a0700c00acb213c01bf6c685"' }>
                                            <li class="link">
                                                <a href="components/BuscarRadicadoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BuscarRadicadoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionarReservaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionarReservaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablaGestionPendienteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablaGestionPendienteComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GestionReservaRoutingModule.html" data-type="entity-link" >GestionReservaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IntervencionModule.html" data-type="entity-link" >IntervencionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-IntervencionModule-211344863713dbcf9bcc2c66cee652d36a45086c9e587e2e062031237ae063d09c261afd21c380aa5de4958101e01785d2c081690b5bcf7198ed2716503adbdf"' : 'data-target="#xs-components-links-module-IntervencionModule-211344863713dbcf9bcc2c66cee652d36a45086c9e587e2e062031237ae063d09c261afd21c380aa5de4958101e01785d2c081690b5bcf7198ed2716503adbdf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IntervencionModule-211344863713dbcf9bcc2c66cee652d36a45086c9e587e2e062031237ae063d09c261afd21c380aa5de4958101e01785d2c081690b5bcf7198ed2716503adbdf"' :
                                            'id="xs-components-links-module-IntervencionModule-211344863713dbcf9bcc2c66cee652d36a45086c9e587e2e062031237ae063d09c261afd21c380aa5de4958101e01785d2c081690b5bcf7198ed2716503adbdf"' }>
                                            <li class="link">
                                                <a href="components/ControlSolicitudesPmtComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ControlSolicitudesPmtComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarAsociarCoiComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarAsociarCoiComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarAsociarSolicitudComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarAsociarSolicitudComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarProgramacionPeriodicaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarProgramacionPeriodicaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgramacionPeriodicaIntervencionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgramacionPeriodicaIntervencionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IntervencionRoutingModule.html" data-type="entity-link" >IntervencionRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LugarModule.html" data-type="entity-link" >LugarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LugarModule-931e9c4e41dec172850ced765435a2a54b491737d49aaec1be36eda65c73b5ffa01e324ad6567591b92f000fd2efb7afdec521458aa82df1dbc54a816974dd9b"' : 'data-target="#xs-components-links-module-LugarModule-931e9c4e41dec172850ced765435a2a54b491737d49aaec1be36eda65c73b5ffa01e324ad6567591b92f000fd2efb7afdec521458aa82df1dbc54a816974dd9b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LugarModule-931e9c4e41dec172850ced765435a2a54b491737d49aaec1be36eda65c73b5ffa01e324ad6567591b92f000fd2efb7afdec521458aa82df1dbc54a816974dd9b"' :
                                            'id="xs-components-links-module-LugarModule-931e9c4e41dec172850ced765435a2a54b491737d49aaec1be36eda65c73b5ffa01e324ad6567591b92f000fd2efb7afdec521458aa82df1dbc54a816974dd9b"' }>
                                            <li class="link">
                                                <a href="components/EliminarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EliminarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LugarRoutingModule.html" data-type="entity-link" >LugarRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MantenimientoModule.html" data-type="entity-link" >MantenimientoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MantenimientoModule-9f22ec67cc6ffadd777ce1929b784acd802fb362b6fb702920a9ebefa69e523af29b31979adfca985e0f8be29394d93dab37a5380cf68c94516dbdab686abedb"' : 'data-target="#xs-components-links-module-MantenimientoModule-9f22ec67cc6ffadd777ce1929b784acd802fb362b6fb702920a9ebefa69e523af29b31979adfca985e0f8be29394d93dab37a5380cf68c94516dbdab686abedb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MantenimientoModule-9f22ec67cc6ffadd777ce1929b784acd802fb362b6fb702920a9ebefa69e523af29b31979adfca985e0f8be29394d93dab37a5380cf68c94516dbdab686abedb"' :
                                            'id="xs-components-links-module-MantenimientoModule-9f22ec67cc6ffadd777ce1929b784acd802fb362b6fb702920a9ebefa69e523af29b31979adfca985e0f8be29394d93dab37a5380cf68c94516dbdab686abedb"' }>
                                            <li class="link">
                                                <a href="components/AsignarConductorOperarioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsignarConductorOperarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CalendarioAsignacionCoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarioAsignacionCoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogoMotivoCancelacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogoMotivoCancelacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarAsignacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarAsignacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarProgramacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarProgramacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarReporteFalloComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditarReporteFalloComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgramarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgramarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportarFalloComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReportarFalloComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MantenimientoRoutingModule.html" data-type="entity-link" >MantenimientoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PersonaModule.html" data-type="entity-link" >PersonaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PersonaModule-606caf28b6f9179ae62dc88fa21473c5576a6682e538b08f8f7a2b0663a1196976090afa65806cf438b08d071dedce2fd0b78ee757e789bc4e30e70a167847b9"' : 'data-target="#xs-components-links-module-PersonaModule-606caf28b6f9179ae62dc88fa21473c5576a6682e538b08f8f7a2b0663a1196976090afa65806cf438b08d071dedce2fd0b78ee757e789bc4e30e70a167847b9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PersonaModule-606caf28b6f9179ae62dc88fa21473c5576a6682e538b08f8f7a2b0663a1196976090afa65806cf438b08d071dedce2fd0b78ee757e789bc4e30e70a167847b9"' :
                                            'id="xs-components-links-module-PersonaModule-606caf28b6f9179ae62dc88fa21473c5576a6682e538b08f8f7a2b0663a1196976090afa65806cf438b08d071dedce2fd0b78ee757e789bc4e30e70a167847b9"' }>
                                            <li class="link">
                                                <a href="components/EliminarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EliminarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PersonaRoutingModule.html" data-type="entity-link" >PersonaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RecursoModule.html" data-type="entity-link" >RecursoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RecursoModule-58882e8fe468283f1c280b517d499fb9e22aa8cf0ee4ecf197f98b3486b2601ec4e498109e5972c61103cead2ee3b0d156130b85a29dc7e8d839f27318201ef7"' : 'data-target="#xs-components-links-module-RecursoModule-58882e8fe468283f1c280b517d499fb9e22aa8cf0ee4ecf197f98b3486b2601ec4e498109e5972c61103cead2ee3b0d156130b85a29dc7e8d839f27318201ef7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RecursoModule-58882e8fe468283f1c280b517d499fb9e22aa8cf0ee4ecf197f98b3486b2601ec4e498109e5972c61103cead2ee3b0d156130b85a29dc7e8d839f27318201ef7"' :
                                            'id="xs-components-links-module-RecursoModule-58882e8fe468283f1c280b517d499fb9e22aa8cf0ee4ecf197f98b3486b2601ec4e498109e5972c61103cead2ee3b0d156130b85a29dc7e8d839f27318201ef7"' }>
                                            <li class="link">
                                                <a href="components/ActualizarNovedadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActualizarNovedadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EliminarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EliminarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InsertarFranjaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsertarFranjaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InsertarNovedadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InsertarNovedadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarFranjaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListarFranjaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarNovedadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListarNovedadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerEquipoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerEquipoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerLugarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerLugarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerPersonaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerPersonaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RecursoRoutingModule.html" data-type="entity-link" >RecursoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RecursoSemanaModule.html" data-type="entity-link" >RecursoSemanaModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RecursoSemanaRoutingModule.html" data-type="entity-link" >RecursoSemanaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegistrarDisenoModule.html" data-type="entity-link" >RegistrarDisenoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegistrarDisenoModule-e419324baee5486cc4fd8940fe010eab287ca012d250a665151ba8b879c4210fd08a08c838f9eeb54e18b9656121959d2310eec02a7f38bcf21e94fb757bd50e"' : 'data-target="#xs-components-links-module-RegistrarDisenoModule-e419324baee5486cc4fd8940fe010eab287ca012d250a665151ba8b879c4210fd08a08c838f9eeb54e18b9656121959d2310eec02a7f38bcf21e94fb757bd50e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistrarDisenoModule-e419324baee5486cc4fd8940fe010eab287ca012d250a665151ba8b879c4210fd08a08c838f9eeb54e18b9656121959d2310eec02a7f38bcf21e94fb757bd50e"' :
                                            'id="xs-components-links-module-RegistrarDisenoModule-e419324baee5486cc4fd8940fe010eab287ca012d250a665151ba8b879c4210fd08a08c838f9eeb54e18b9656121959d2310eec02a7f38bcf21e94fb757bd50e"' }>
                                            <li class="link">
                                                <a href="components/ActualizarAlternativaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActualizarAlternativaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultaApiquesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaApiquesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarAlternativasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListarAlternativasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroAlternativaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroAlternativaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroCapaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroCapaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroDisenoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroDisenoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroInsumosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroInsumosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerAlternativaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerAlternativaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerFallasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerFallasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerFotosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerFotosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerOtroFactorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerOtroFactorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistrarDisenoRoutingModule.html" data-type="entity-link" >RegistrarDisenoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroDiarioPorCuadrillaModule.html" data-type="entity-link" >RegistroDiarioPorCuadrillaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' : 'data-target="#xs-components-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' :
                                            'id="xs-components-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' }>
                                            <li class="link">
                                                <a href="components/DialogConfirmComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogConfirmComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroDiarioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroDiarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionCantidadesDeObraComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionCantidadesDeObraComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionControlDeCalidadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionControlDeCalidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionInformacionDelPersonalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionInformacionDelPersonalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionInformacionGeneralComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionInformacionGeneralComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionMaquinariaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionMaquinariaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionMaterialesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionMaterialesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionMezclaAsfalticasConcretosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionMezclaAsfalticasConcretosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionObservacionesGeneralesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionObservacionesGeneralesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionRetiroMaterialesEscombrosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionRetiroMaterialesEscombrosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabSeccionesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TabSeccionesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' : 'data-target="#xs-directives-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' :
                                        'id="xs-directives-links-module-RegistroDiarioPorCuadrillaModule-854bf2e3591d77c347b72994f38e41483c4fbadaa8071dce940c4d55791d048a29a732eb698010cf1fe27c80ec576267c6ab0c2484ac089777df91241bf2f627"' }>
                                        <li class="link">
                                            <a href="directives/MsgErrorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsgErrorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroDiarioPorCuadrillaRoutingModule.html" data-type="entity-link" >RegistroDiarioPorCuadrillaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroProgramacionDiariaModule.html" data-type="entity-link" >RegistroProgramacionDiariaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' : 'data-target="#xs-components-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' :
                                            'id="xs-components-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' }>
                                            <li class="link">
                                                <a href="components/DialogConfirmComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogConfirmComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionEquipoPortatilComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionEquipoPortatilComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionInspeccionYOficialCuadrillaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionInspeccionYOficialCuadrillaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionMaterialComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionMaterialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionPersonalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionPersonalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SeccionProgramacionDiariaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeccionProgramacionDiariaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' : 'data-target="#xs-directives-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' :
                                        'id="xs-directives-links-module-RegistroProgramacionDiariaModule-6bd6f67ba5f3c1c9621823cba92b345692bb937248a7be770cd9e635e0f31150c877daa765e621b4697fe3ee88f9b79c89ba2116c767956b86f56d8502ddfac9"' }>
                                        <li class="link">
                                            <a href="directives/MsgErrorDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MsgErrorDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroProgramacionDiariaRoutingModule.html" data-type="entity-link" >RegistroProgramacionDiariaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroVisitaDiagnosticoModule.html" data-type="entity-link" >RegistroVisitaDiagnosticoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' : 'data-target="#xs-components-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' :
                                            'id="xs-components-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' }>
                                            <li class="link">
                                                <a href="components/ActualizarApiquesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ActualizarApiquesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ApiquesAledaniosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ApiquesAledaniosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AutoprogramarVisitaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutoprogramarVisitaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarApiquesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListarApiquesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalAutoprogramarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalAutoprogramarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroApiqueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroApiqueComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroFallasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroFallasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroFotoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroFotoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroOtrosFactoresComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroOtrosFactoresComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroUnidadMuestreoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroUnidadMuestreoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroVisitaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroVisitaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroVisitaDiagnosticoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroVisitaDiagnosticoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UbicarApiqueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UbicarApiqueComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' : 'data-target="#xs-injectables-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' :
                                        'id="xs-injectables-links-module-RegistroVisitaDiagnosticoModule-6365e90c9fd598eed7e2ebe205ec6cbd09af350e9ab83e4fbbe51ae76d7796f144dcd2ddae90dfbf51242798ca9053f241c314c1dabe7a575ad8e063da5d310d"' }>
                                        <li class="link">
                                            <a href="injectables/FormFallasGeneradorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormFallasGeneradorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FormUnidadesMuestreoGeneradorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FormUnidadesMuestreoGeneradorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroVisitaDiagnosticoRoutingModule.html" data-type="entity-link" >RegistroVisitaDiagnosticoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroVisitaVerificacionModule.html" data-type="entity-link" >RegistroVisitaVerificacionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegistroVisitaVerificacionModule-06384e9d89a711f2ef733461f9b748ee96fe1fe87ce4ade0ee4f55eecefb999711ed6ff1c8a639ced2873995f4b4a1843d1e308172ea8570203f8ca452c58f14"' : 'data-target="#xs-components-links-module-RegistroVisitaVerificacionModule-06384e9d89a711f2ef733461f9b748ee96fe1fe87ce4ade0ee4f55eecefb999711ed6ff1c8a639ced2873995f4b4a1843d1e308172ea8570203f8ca452c58f14"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistroVisitaVerificacionModule-06384e9d89a711f2ef733461f9b748ee96fe1fe87ce4ade0ee4f55eecefb999711ed6ff1c8a639ced2873995f4b4a1843d1e308172ea8570203f8ca452c58f14"' :
                                            'id="xs-components-links-module-RegistroVisitaVerificacionModule-06384e9d89a711f2ef733461f9b748ee96fe1fe87ce4ade0ee4f55eecefb999711ed6ff1c8a639ced2873995f4b4a1843d1e308172ea8570203f8ca452c58f14"' }>
                                            <li class="link">
                                                <a href="components/AreaIntervencionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AreaIntervencionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaVerificacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaVerificacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NovedadadesIntervencionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NovedadadesIntervencionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroVisitaVerificacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistroVisitaVerificacionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistroVisitaVerificacionRoutingModule.html" data-type="entity-link" >RegistroVisitaVerificacionRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RevisarDisenoModule.html" data-type="entity-link" >RevisarDisenoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RevisarDisenoModule-08a6acc58464bc4bdc8520e1700eb323cf2fd220b68ffc98dee2c49a7d6452f0285a01928617be6198e413a5eb46ca4aa77e54eac4006d58171bd3e6028060c3"' : 'data-target="#xs-components-links-module-RevisarDisenoModule-08a6acc58464bc4bdc8520e1700eb323cf2fd220b68ffc98dee2c49a7d6452f0285a01928617be6198e413a5eb46ca4aa77e54eac4006d58171bd3e6028060c3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RevisarDisenoModule-08a6acc58464bc4bdc8520e1700eb323cf2fd220b68ffc98dee2c49a7d6452f0285a01928617be6198e413a5eb46ca4aa77e54eac4006d58171bd3e6028060c3"' :
                                            'id="xs-components-links-module-RevisarDisenoModule-08a6acc58464bc4bdc8520e1700eb323cf2fd220b68ffc98dee2c49a7d6452f0285a01928617be6198e413a5eb46ca4aa77e54eac4006d58171bd3e6028060c3"' }>
                                            <li class="link">
                                                <a href="components/RevisarDisenoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RevisarDisenoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RevisarDisenoRoutingModule.html" data-type="entity-link" >RevisarDisenoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RevisionVisitaDiagnosticoModule.html" data-type="entity-link" >RevisionVisitaDiagnosticoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RevisionVisitaDiagnosticoModule-cc64436b334affe818234c421b72d2551c2d0cd23ff699e644088f70e9296c5bf3e994327ae348f85ce8313bfc9f499a6aaa60dda9c60ba8078d2a535204c669"' : 'data-target="#xs-components-links-module-RevisionVisitaDiagnosticoModule-cc64436b334affe818234c421b72d2551c2d0cd23ff699e644088f70e9296c5bf3e994327ae348f85ce8313bfc9f499a6aaa60dda9c60ba8078d2a535204c669"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RevisionVisitaDiagnosticoModule-cc64436b334affe818234c421b72d2551c2d0cd23ff699e644088f70e9296c5bf3e994327ae348f85ce8313bfc9f499a6aaa60dda9c60ba8078d2a535204c669"' :
                                            'id="xs-components-links-module-RevisionVisitaDiagnosticoModule-cc64436b334affe818234c421b72d2551c2d0cd23ff699e644088f70e9296c5bf3e994327ae348f85ce8313bfc9f499a6aaa60dda9c60ba8078d2a535204c669"' }>
                                            <li class="link">
                                                <a href="components/RevisarVisitaDiagnosticoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RevisarVisitaDiagnosticoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RevisionVisitaDiagnosticoRoutingModule.html" data-type="entity-link" >RevisionVisitaDiagnosticoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-c96ab880ef870dbd093da2369d28608ed4a54724b5952c89099b76b4d76ac2209ddf6c68c0e89c9657aea0e75d7ee56c2579f1c30d38ce863b218c609e42ddd6"' : 'data-target="#xs-components-links-module-SharedModule-c96ab880ef870dbd093da2369d28608ed4a54724b5952c89099b76b4d76ac2209ddf6c68c0e89c9657aea0e75d7ee56c2579f1c30d38ce863b218c609e42ddd6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-c96ab880ef870dbd093da2369d28608ed4a54724b5952c89099b76b4d76ac2209ddf6c68c0e89c9657aea0e75d7ee56c2579f1c30d38ce863b218c609e42ddd6"' :
                                            'id="xs-components-links-module-SharedModule-c96ab880ef870dbd093da2369d28608ed4a54724b5952c89099b76b4d76ac2209ddf6c68c0e89c9657aea0e75d7ee56c2579f1c30d38ce863b218c609e42ddd6"' }>
                                            <li class="link">
                                                <a href="components/AvanceMantenimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AvanceMantenimientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AvanceMasivoMantenimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AvanceMasivoMantenimientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BusquedaMantenimientosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BusquedaMantenimientosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CargueArchivoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CargueArchivoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultaAlternativaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaAlternativaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultaDisenioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaDisenioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultaVisitaDiagnosticoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaVisitaDiagnosticoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultaVisitaEncabezadoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultaVisitaEncabezadoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsultarApiquesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConsultarApiquesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateLugarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateLugarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogConfirmComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogConfirmComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionMasivaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionMasivaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialMantenimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HistorialMantenimientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaAlternativaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaAlternativaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaContratosMqeqComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaContratosMqeqComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaFallosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaFallosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaFranjasComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaFranjasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaLugarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaLugarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaMaqEquDisponiblesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaMaqEquDisponiblesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaMaqEquVigentesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaMaqEquVigentesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaMaquinariaEquiposComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaMaquinariaEquiposComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaPendientesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaPendientesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaPksActaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaPksActaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaPksAsociarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaPksAsociarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaProgramacionPeriocidadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaProgramacionPeriocidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaProgramacionSinpmtComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaProgramacionSinpmtComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaRadicadosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaRadicadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaSeguimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaSeguimientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaTransicionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListaTransicionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapaUmvComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MapaUmvComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrarInsumosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrarInsumosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrarPriorizacionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrarPriorizacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablaFiltrosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablaFiltrosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerParametrosDisenioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VerParametrosDisenioComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SolicitudEnsayoLaboratorioModule.html" data-type="entity-link" >SolicitudEnsayoLaboratorioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SolicitudEnsayoLaboratorioModule-bb70782d4509a62036854fb2601c714b538927c3c2795a32df767e4f815a4962780074bac48fe00a379c8bc51fa251ea6d7f626938db9f3a80a25edf1654eb17"' : 'data-target="#xs-components-links-module-SolicitudEnsayoLaboratorioModule-bb70782d4509a62036854fb2601c714b538927c3c2795a32df767e4f815a4962780074bac48fe00a379c8bc51fa251ea6d7f626938db9f3a80a25edf1654eb17"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SolicitudEnsayoLaboratorioModule-bb70782d4509a62036854fb2601c714b538927c3c2795a32df767e4f815a4962780074bac48fe00a379c8bc51fa251ea6d7f626938db9f3a80a25edf1654eb17"' :
                                            'id="xs-components-links-module-SolicitudEnsayoLaboratorioModule-bb70782d4509a62036854fb2601c714b538927c3c2795a32df767e4f815a4962780074bac48fe00a379c8bc51fa251ea6d7f626938db9f3a80a25edf1654eb17"' }>
                                            <li class="link">
                                                <a href="components/InformeDetalleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InformeDetalleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalConfirmarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalConfirmarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalListaEnsayosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalListaEnsayosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalListaMaterialesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalListaMaterialesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalTableAsociarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalTableAsociarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistrarServicioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegistrarServicioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServicioApiquesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServicioApiquesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServicioDensidadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServicioDensidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServicioFormulaComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServicioFormulaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServicioNucleoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServicioNucleoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServicioOtrosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ServicioOtrosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicitudEnsayoLaboratorioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SolicitudEnsayoLaboratorioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableMantenimientosActivosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableMantenimientosActivosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableNomenclaturaApiqueComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableNomenclaturaApiqueComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SolicitudEnsayoLaboratorioRoutingModule.html" data-type="entity-link" >SolicitudEnsayoLaboratorioRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ValidacionVisitaDiagnosticoModule.html" data-type="entity-link" >ValidacionVisitaDiagnosticoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ValidacionVisitaDiagnosticoModule-ff0618d9a3ae8a7f06171fc697795bbd2ff72f944af423c97f225cbb2ed0330195dca50ebd3d5d19ca64cde18240f6a7c1b4430318d7f4d4ac87add942eb460c"' : 'data-target="#xs-components-links-module-ValidacionVisitaDiagnosticoModule-ff0618d9a3ae8a7f06171fc697795bbd2ff72f944af423c97f225cbb2ed0330195dca50ebd3d5d19ca64cde18240f6a7c1b4430318d7f4d4ac87add942eb460c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ValidacionVisitaDiagnosticoModule-ff0618d9a3ae8a7f06171fc697795bbd2ff72f944af423c97f225cbb2ed0330195dca50ebd3d5d19ca64cde18240f6a7c1b4430318d7f4d4ac87add942eb460c"' :
                                            'id="xs-components-links-module-ValidacionVisitaDiagnosticoModule-ff0618d9a3ae8a7f06171fc697795bbd2ff72f944af423c97f225cbb2ed0330195dca50ebd3d5d19ca64cde18240f6a7c1b4430318d7f4d4ac87add942eb460c"' }>
                                            <li class="link">
                                                <a href="components/ValidacionVisitaDiagnosticoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidacionVisitaDiagnosticoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ValidarVisitaDiagnosticoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidarVisitaDiagnosticoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ValidacionVisitaDiagnosticoRoutingModule.html" data-type="entity-link" >ValidacionVisitaDiagnosticoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ValidarDisenoModule.html" data-type="entity-link" >ValidarDisenoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ValidarDisenoModule-94b0f50c88afc664378ccc7a0d0c327c85dec7b752f4286cf5f510a9f108f0467d6f5c39ebaabc4102a18b6bfc2ce8e111ba9030e584728d41a46714d5ec9498"' : 'data-target="#xs-components-links-module-ValidarDisenoModule-94b0f50c88afc664378ccc7a0d0c327c85dec7b752f4286cf5f510a9f108f0467d6f5c39ebaabc4102a18b6bfc2ce8e111ba9030e584728d41a46714d5ec9498"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ValidarDisenoModule-94b0f50c88afc664378ccc7a0d0c327c85dec7b752f4286cf5f510a9f108f0467d6f5c39ebaabc4102a18b6bfc2ce8e111ba9030e584728d41a46714d5ec9498"' :
                                            'id="xs-components-links-module-ValidarDisenoModule-94b0f50c88afc664378ccc7a0d0c327c85dec7b752f4286cf5f510a9f108f0467d6f5c39ebaabc4102a18b6bfc2ce8e111ba9030e584728d41a46714d5ec9498"' }>
                                            <li class="link">
                                                <a href="components/ValidarDisenoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ValidarDisenoComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ValidarDisenoRoutingModule.html" data-type="entity-link" >ValidarDisenoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/VincularPksModule.html" data-type="entity-link" >VincularPksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-VincularPksModule-cbcf2c8cdb0ca440f6640f851ac8160281eb8063eb4d530ac9f71f853256fcf9b4a31677e6030c0d5e3fe3ef7a3c9608d112cef99b3d05ffea0c8e7d293289ba"' : 'data-target="#xs-components-links-module-VincularPksModule-cbcf2c8cdb0ca440f6640f851ac8160281eb8063eb4d530ac9f71f853256fcf9b4a31677e6030c0d5e3fe3ef7a3c9608d112cef99b3d05ffea0c8e7d293289ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VincularPksModule-cbcf2c8cdb0ca440f6640f851ac8160281eb8063eb4d530ac9f71f853256fcf9b4a31677e6030c0d5e3fe3ef7a3c9608d112cef99b3d05ffea0c8e7d293289ba"' :
                                            'id="xs-components-links-module-VincularPksModule-cbcf2c8cdb0ca440f6640f851ac8160281eb8063eb4d530ac9f71f853256fcf9b4a31677e6030c0d5e3fe3ef7a3c9608d112cef99b3d05ffea0c8e7d293289ba"' }>
                                            <li class="link">
                                                <a href="components/AsignarMisionalidadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsignarMisionalidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsignarSeguimientoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsignarSeguimientoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GestionarPeticionarioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GestionarPeticionarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SegMapaUmvComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SegMapaUmvComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablaRadicadoVinculadoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablaRadicadoVinculadoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablaSeguimientosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablaSeguimientosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TablaVincularComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TablaVincularComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VincularPeticionarioComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VincularPeticionarioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WebMapaUmvComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebMapaUmvComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VincularPksRoutingModule.html" data-type="entity-link" >VincularPksRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/VisorFotosModule.html" data-type="entity-link" >VisorFotosModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-VisorFotosModule-c85a15b3e07e0e6aad06f3e8ba7a37757317baa39fcfb502543ece2af6877b5156e206cd772f7c332c3b8e57e3d958ec2e5bfba8c90302ca3bdd282cc3434702"' : 'data-target="#xs-components-links-module-VisorFotosModule-c85a15b3e07e0e6aad06f3e8ba7a37757317baa39fcfb502543ece2af6877b5156e206cd772f7c332c3b8e57e3d958ec2e5bfba8c90302ca3bdd282cc3434702"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VisorFotosModule-c85a15b3e07e0e6aad06f3e8ba7a37757317baa39fcfb502543ece2af6877b5156e206cd772f7c332c3b8e57e3d958ec2e5bfba8c90302ca3bdd282cc3434702"' :
                                            'id="xs-components-links-module-VisorFotosModule-c85a15b3e07e0e6aad06f3e8ba7a37757317baa39fcfb502543ece2af6877b5156e206cd772f7c332c3b8e57e3d958ec2e5bfba8c90302ca3bdd282cc3434702"' }>
                                            <li class="link">
                                                <a href="components/VisorFotosComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VisorFotosComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VisorFotosRoutingModule.html" data-type="entity-link" >VisorFotosRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ActualizarComponent-1.html" data-type="entity-link" >ActualizarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActualizarComponent-2.html" data-type="entity-link" >ActualizarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActualizarComponent-3.html" data-type="entity-link" >ActualizarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActualizarComponent-4.html" data-type="entity-link" >ActualizarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogConfirmComponent-1.html" data-type="entity-link" >DialogConfirmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogConfirmComponent-2.html" data-type="entity-link" >DialogConfirmComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EliminarComponent-1.html" data-type="entity-link" >EliminarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EliminarComponent-2.html" data-type="entity-link" >EliminarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EliminarComponent-3.html" data-type="entity-link" >EliminarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InsertarComponent-1.html" data-type="entity-link" >InsertarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InsertarComponent-2.html" data-type="entity-link" >InsertarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InsertarComponent-3.html" data-type="entity-link" >InsertarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InsertarComponent-4.html" data-type="entity-link" >InsertarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListarComponent-1.html" data-type="entity-link" >ListarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListarComponent-2.html" data-type="entity-link" >ListarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListarComponent-3.html" data-type="entity-link" >ListarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListarComponent-4.html" data-type="entity-link" >ListarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalConfirmarComponent-1.html" data-type="entity-link" >ModalConfirmarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalConfirmarComponent-2.html" data-type="entity-link" >ModalConfirmarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegistroDiarioComponent-1.html" data-type="entity-link" >RegistroDiarioComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SeccionMaquinariaComponent-1.html" data-type="entity-link" >SeccionMaquinariaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TabSeccionesComponent-1.html" data-type="entity-link" >TabSeccionesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VerComponent-1.html" data-type="entity-link" >VerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VerComponent-2.html" data-type="entity-link" >VerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VerComponent-3.html" data-type="entity-link" >VerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VerComponent-4.html" data-type="entity-link" >VerComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/MsgErrorDirective-1.html" data-type="entity-link" >MsgErrorDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Archivo.html" data-type="entity-link" >Archivo</a>
                            </li>
                            <li class="link">
                                <a href="classes/DominioItem.html" data-type="entity-link" >DominioItem</a>
                            </li>
                            <li class="link">
                                <a href="classes/Falla.html" data-type="entity-link" >Falla</a>
                            </li>
                            <li class="link">
                                <a href="classes/MantenimientoVial.html" data-type="entity-link" >MantenimientoVial</a>
                            </li>
                            <li class="link">
                                <a href="classes/OtroFactor.html" data-type="entity-link" >OtroFactor</a>
                            </li>
                            <li class="link">
                                <a href="classes/PopupTemplate.html" data-type="entity-link" >PopupTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Radicado.html" data-type="entity-link" >Radicado</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnidadMuestreo.html" data-type="entity-link" >UnidadMuestreo</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AforoAnalisisService.html" data-type="entity-link" >AforoAnalisisService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AforoDatoService.html" data-type="entity-link" >AforoDatoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BuscarRadicadoOrfeoService.html" data-type="entity-link" >BuscarRadicadoOrfeoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CargarDocumentoService.html" data-type="entity-link" >CargarDocumentoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CargueArchivoDocumentoService.html" data-type="entity-link" >CargueArchivoDocumentoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CargueArchivoService.html" data-type="entity-link" >CargueArchivoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CargueResultadoEnsayoService.html" data-type="entity-link" >CargueResultadoEnsayoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConsultaListaBandejaPendienteService.html" data-type="entity-link" >ConsultaListaBandejaPendienteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConsultaListaRevisionVisitaService.html" data-type="entity-link" >ConsultaListaRevisionVisitaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConsultaListasService.html" data-type="entity-link" >ConsultaListasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConsultasMejoramientoService.html" data-type="entity-link" >ConsultasMejoramientoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabAforoService.html" data-type="entity-link" >EntityTabAforoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabAledanioService.html" data-type="entity-link" >EntityTabAledanioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabAlternativaService.html" data-type="entity-link" >EntityTabAlternativaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabApiqueService.html" data-type="entity-link" >EntityTabApiqueService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabArchivoServiceService.html" data-type="entity-link" >EntityTabArchivoServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabCapaService.html" data-type="entity-link" >EntityTabCapaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabEquipoService.html" data-type="entity-link" >EntityTabEquipoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabEventoService.html" data-type="entity-link" >EntityTabEventoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabFallasServiceService.html" data-type="entity-link" >EntityTabFallasServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabFranjaService.html" data-type="entity-link" >EntityTabFranjaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabLugarService.html" data-type="entity-link" >EntityTabLugarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabMantenimientoVialService.html" data-type="entity-link" >EntityTabMantenimientoVialService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabNovedadService.html" data-type="entity-link" >EntityTabNovedadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabOtrosFactoresServiceService.html" data-type="entity-link" >EntityTabOtrosFactoresServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabPersonaService.html" data-type="entity-link" >EntityTabPersonaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabRecursoService.html" data-type="entity-link" >EntityTabRecursoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EntityTabUnidadMuestreoService.html" data-type="entity-link" >EntityTabUnidadMuestreoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormFallasGeneradorService.html" data-type="entity-link" >FormFallasGeneradorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FormUnidadesMuestreoGeneradorService.html" data-type="entity-link" >FormUnidadesMuestreoGeneradorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GestionService.html" data-type="entity-link" >GestionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IntervencionService.html" data-type="entity-link" >IntervencionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MantenimientoVialEventoService.html" data-type="entity-link" >MantenimientoVialEventoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProcesoIntervencionService.html" data-type="entity-link" >ProcesoIntervencionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProcesoMantenimientoService.html" data-type="entity-link" >ProcesoMantenimientoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramacionDiariaCuadrillaService.html" data-type="entity-link" >ProgramacionDiariaCuadrillaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramacionService.html" data-type="entity-link" >ProgramacionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RegistroProgramacionDiariaService.html" data-type="entity-link" >RegistroProgramacionDiariaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SecurityService.html" data-type="entity-link" >SecurityService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SolicitudEnsayoLaboratorioService.html" data-type="entity-link" >SolicitudEnsayoLaboratorioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilitariosService.html" data-type="entity-link" >UtilitariosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UtilService.html" data-type="entity-link" >UtilService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VincularRadicadoService.html" data-type="entity-link" >VincularRadicadoService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/LoginGuard.html" data-type="entity-link" >LoginGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AforoAnalisis.html" data-type="entity-link" >AforoAnalisis</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AforoCalzada.html" data-type="entity-link" >AforoCalzada</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AforoDato.html" data-type="entity-link" >AforoDato</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Alternativa.html" data-type="entity-link" >Alternativa</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Apique.html" data-type="entity-link" >Apique</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Asignacion.html" data-type="entity-link" >Asignacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BandejaGestionPendiente.html" data-type="entity-link" >BandejaGestionPendiente</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Calidad.html" data-type="entity-link" >Calidad</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CantidadObra.html" data-type="entity-link" >CantidadObra</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Capa.html" data-type="entity-link" >Capa</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CargarDocumento.html" data-type="entity-link" >CargarDocumento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-1.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-2.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-3.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-4.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-5.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData-6.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Disponible.html" data-type="entity-link" >Disponible</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Equipo.html" data-type="entity-link" >Equipo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EquipoConsultarXFiltro.html" data-type="entity-link" >EquipoConsultarXFiltro</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Fallo.html" data-type="entity-link" >Fallo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Franja.html" data-type="entity-link" >Franja</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEntityService.html" data-type="entity-link" >IEntityService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/informeDetalle.html" data-type="entity-link" >informeDetalle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/listaEnsayo.html" data-type="entity-link" >listaEnsayo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/listaMateriales.html" data-type="entity-link" >listaMateriales</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/listaPKMantActivos.html" data-type="entity-link" >listaPKMantActivos</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-1.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-2.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-3.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-4.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-5.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-6.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-7.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-8.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LooseObject-9.html" data-type="entity-link" >LooseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Lugar.html" data-type="entity-link" >Lugar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mantenimineto.html" data-type="entity-link" >Mantenimineto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Maquinaria.html" data-type="entity-link" >Maquinaria</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/maquinariaCrud.html" data-type="entity-link" >maquinariaCrud</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/materialCrud.html" data-type="entity-link" >materialCrud</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Materiales.html" data-type="entity-link" >Materiales</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mezcla.html" data-type="entity-link" >Mezcla</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Novedad.html" data-type="entity-link" >Novedad</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Observaciones.html" data-type="entity-link" >Observaciones</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Periodo.html" data-type="entity-link" >Periodo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Persona.html" data-type="entity-link" >Persona</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Personal.html" data-type="entity-link" >Personal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/personalCrud.html" data-type="entity-link" >personalCrud</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Personas.html" data-type="entity-link" >Personas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/progDiariaCrud.html" data-type="entity-link" >progDiariaCrud</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProgramacionPeriocidad.html" data-type="entity-link" >ProgramacionPeriocidad</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Radicado.html" data-type="entity-link" >Radicado</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Recurso.html" data-type="entity-link" >Recurso</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegistroDiarioPorCuadrilla.html" data-type="entity-link" >RegistroDiarioPorCuadrilla</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Relacion.html" data-type="entity-link" >Relacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Respuesta.html" data-type="entity-link" >Respuesta</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RevisionVisitas.html" data-type="entity-link" >RevisionVisitas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SalidaMaterial.html" data-type="entity-link" >SalidaMaterial</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SolicitudEnsayoLaboratorio.html" data-type="entity-link" >SolicitudEnsayoLaboratorio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SolicitudPmt.html" data-type="entity-link" >SolicitudPmt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TabItem.html" data-type="entity-link" >TabItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoDocumentos.html" data-type="entity-link" >TipoDocumentos</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Transicion.html" data-type="entity-link" >Transicion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TransicionActa.html" data-type="entity-link" >TransicionActa</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Transiciones.html" data-type="entity-link" >Transiciones</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Vigencia.html" data-type="entity-link" >Vigencia</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});