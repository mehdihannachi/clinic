var french = {};
var english = {};
var arabe = {};

french = {
	//GLOBAL
	"NOT_CONFIRMED" : "Non confirmé",
	"CONFIRMED" : "Confirmé",
	"FORGOTPASSWORD" : "Mots de passe oublié",
	"RESETPASSWORD" : "Réinitialiser mon mot de passe",
	"FORGOTTEDPASSWORD" : "Mot de passe réinitialiser",
	"CANCLED" : "Annulé",
	"CANCEL" : "Annuler",
	"CONFIRM" : "Confirmer",
	"WAITING_TO_CONFIRMATION" : "En attente de confirmation",
	"LOADING_WITH_POINT" : "Chargement ...",
	"BACK_TO_HOME" : "Aller à la page d'accueil",
	"UPDATE_BUTTON" : "Mettre à jour",
	"CHANGE_THE_DATE" : "Changer la date",
	"NAME" : "Nom",
	"LASTNAME" : "Prénom",
	"EMAIL" : "E-mail",
	"TEL" : "Télephone",
	"ADDRESS" : "Adresse",
	"VILLEG" : "Ville" ,
	"PASSWORD" : "Mot de passe",
	"OR" : "ou",
	"HERE" : "ici",
	"STATUS" : "Statut",
	"DORTOR_SPACE" : "Espace medecin",
	"MY_PATIENTS" : "Mes patients",
	"REPORT" : "Report",
	"REPORT" : "Report",
	"NEXT" : "Suivant",
	"PREV" : "Précédent",
	"CALENDAR" : "Calendrier",
	"CODEPOSTAL" : "Code postal",
	"US_VERIFICATION" :"Veuillez vérifier les champs ci-dessous",
	"OUI" :"oui",
	"NON" : "Non",
	"VILLE":"sélectionner une ville",
	"US_IDENTIFICATION":"S'identifier",
	"US_COMPTE" :"Vous avez déjà un compte?",
	"CHARGEMENT": "Chargement ..." ,
    "CHARGEMENT_EN_COURS":"Chargement en cours ... " ,
     "CONFIRMATION":"Confirmation" ,
     "SEND" :"Envoyer ",
     "SUCCESS" :"Success",
     "ERROR" :"Erreur",
     "PLUS" :"Afficher plus",
     "MOINS" :"Afficher moins",
     "AUTORISATION ":"Autoriser",
     "AUTORISATION_ANNULER":"Annuler l'autorisation",
     "MEDECIN_NON_TROUVER":"Aucun médecin trouvé",
     "WITH" :"Avec",
     "PASSWORD_ACTUEL":"Veuillez saisir votre mot de passe actuel",
     "PASSWORD_NEW":"Veuillez ressaisir votre nouveau mot de passe",
     "PASSWORD_RENEW":"Veuillez ré-entrez le nouveau mot de passe",
     "PASSWORD_FAILURE":"Le mot de passe ne correspond pas",


	//Nav
	"PULICPROFILE": "Porfile public",
	"HELLO": "Bonjour",
   "PATIENTI":" Patient ? Inscrivez-vous",
  "MEDECINR":" Médecin ? Rejoignez-nous!",
  "CONNEXION" :"Connexion",
   "DOSSIER":"Mon dossier médical",
   "COMPTE":" Mon compte",
   "MODIF_COMPTE":"Modifier mon profile",
   "ESPACE_MEDECIN":"Espace Medecin",
    "CALENDRIER_RDV":"Calendrier des rendez vous",
    "DECONNECT":"Se Déconnecter",
    "ACCEDER_COMPTE":"Accéder à mon compte",
    "MEDECIN": " Médecin",
    "PATIENT": " Patient",
    "REJOINDRE":"Rejoignez-nous!",
    "INSCRIRE":" Inscrivez-vous",

    //login
    "LOG_ESPACE_PRO":"Espace Professionnel",
    "LOG_CONNECTER_Vous":" Connectez-vous",
    "LOG_ESPACE_PATIENT":"Espace Patient",
    "LOG_ACCEDER_RDV":" Accédez à vos rendez-vous",

  
	// error && success message
	// patient profile error update
	"PP_ERROR_UPDATE"  : "Une erreur s'est produite",
	"PP_SUCCESS_UPDATE"  : "Votre profil est mis à jour.",


	// Patient Profile Template 
	"PPT_CONTAINER_TITLE": "Mes rendez vous",
	"PPT_CONTAINER_NO_APPOINTEMENT": "Vous n'avez pas encore réserver un rendez-vous. ",
	"PPT_CONTAINER_RESERVEONE": "Réserver un",
	"PPT_CONTAINER_FIND_BY": "Recherche avec Date, Medecin ...",
	"PPT_MODAL_CHANGEDATE_SUCCESS" : "Rendez-vous mis à jour avec succès",
	"PPT_MODAL_CHANGEDATE_ERROR" : "Une erreur s'est produite .<br>Erreur possible :<br>La date choisie est dans le passé.<br> La date choisie est n'est pas valide.",
	"PPT_MODAL_CHANGEDATE_NO_TIME_SESSION_FOUND" : "Il n'y a pas de temps disponible pour cette date",
	"PPT_PAGE_TITLE" : "Mes rendez-vous",
	"ULT_CONTAINER_TITLE" : "Espace Patients",
	"ULT_CONSULT_APPOINTMENT" : "Consulter mes rendez vous",
	"ULT_PAGE_TITLE" : "Patient connecter vous",

	//reserver
	"RESERV_TITLE":"Reserver un rendez vous",
	"RESERV_TXT1":"Vous êtes sur le point de réserver",
    "RESERV_TXT2":"un rendez-vous avec",
    "RESERV_CONFIRMER_RDV":" Confirmer le rendez-vous",
    "RESERV_CONNECTER":"Vous devez vous connecter pour continuer si vous avez un compte Docteury, sinon vous pouvez",
    "RESERV_CONNECTER_CONTINUER":" Connecter et continuer",

 

	// patient edit appointment 
    "PEA_TITLE":"Modifier le renez-vous",
    "PEA_RETOUR_RDV":"Retour à mes rendez-vous",
    "PEA_TXT":"Vous êtes sur le point de modifier votre rendez-vous",
    "PEA_PAS_HEURES":"Il n'y a pas d'heure disponible",
    "PEA_ATTENTE_CONFIRMATION":"Le changement de la date du rendez-vous se met automatiquement le status en attente de confirmation",
    "PEA_ERROR":"Une erreur s'est produite.",
    "PEA_RETOUR":"Aller à la page d'accueil",

    //Medical folder
    "MFP_TITLE":"Dossier medical",
    "MFP_PARTAGER":"Partager",
    "MFP_AJOUT_DOC":"Ajouter un nouveau document",
    "MFP_AJOUT_TXT":"Vous pouvez ajouter autant documents que vous voulez.",
    "MFP_type_FICHIERS":"Types de fichiers autorisés  : Tous les types d'images",
    "MFP_PARCOURIR":"Parcourir",
    "MFP_IMAGE_INVALIDE":"Le type d'image n'est pas valide.",
    "MFP_DOSSIER_NON_PARTAGER":"Votre dossier n'est pas partagé avec aucun médecin",
    "MFP_DOSSIER_PARTAGER":"Votre dossier est partagé avec",
    "MFP_MEDECINS":"médecin(s)",
    "MFP_SUPPRIMER":"Supprimer",
    "MFP_TRANSFERER":"Transférer",
    "MFP_AJOUT_MEDECIN":" Autoriser un médecin",
    "MFP_INPUT_MEDECIN":"Nom du Médecin",
    "MFP_SUPPRIMER":"Supprimer",
    "MFP_AJOUT_AVANT_AUTORISATION":"Ajouter des fichiers avant d'autoriser l'accès",
    "MFP_MEDECIN_AUTORISER":"Les médecins qui sont déjà autorisés",

    //updateuser patient

     "UP_TITLE":"Espace patient",
     "UP_MODIF":"Modifier mes informations",
     "UP_VERIF":"Veuillez vérifier les champs ci-dessous",


	//Doctors
	"DH_ACCOUNT_NOT_VERIFIED" : "Votre compte n'est pas encore vérifié, un membre de notre équipe vous contactera dans les plus brefs délais.",
	"DH_ACCOUNT_CHANGE_PAMARS" : "Veuillez régler l'horaire du travail et la durée de la séance",
	"DH_CONTAINER_TITLE" : "Espace medecin",
	"DH_APPOINTMENT_NOT_CONFIRMED" : "Rendez-vous non confirmé",
	"DH_APPOINTMENT_NOT_CONFIRMED_EMPTY" : "Vous n'avez pas des rendez-vous non confirmés",
	"DH_TODAY_APPOINTMENT" : "Rendez-vous d'aujourd'hui",
	"DH_TODAY_APPOINTMENT_EMPTY" : "Vous n'avez pas des rendez-vous aujourd'hui",
	"DH_ALL_APPOINTMENT" : "Tous les rendez vous",
	"DH_ALL_APPOINTMENT_EMPTY" : "Vous n'avez pas des rendez-vous non confirmés",
	"DH_NON_CONFIRMER" : "Non confirmé",
	"DH_ATTENTE_CONFIRMATION" : "En attente de confirmation",
	"DH_CONFIRMER" : "Confirmé",
	"DH_CHANGEMENT_DATE":"Changer la date",
    "DH_LE":"Le",
    "DH_AVEC":"Avec le(a) patient(e)",
    "DH_NOTE":"Note",
    "DH_MODIFIER":"MODIFIER",
    "DH_AJOUTER":"Ajouter",
    "DH_ANNULER_RDV":"Annuler le rendez vous",
    "DH_METTREJOUR":"Mettre à jour",
    "DH_RECHERCHE_AVEC_DATE":"Recherche avec Date, Patient ...",
    

	//Calendar
	"DPC_PAGE_TITLE" : "Calendrier",
	"DPC_CONTAINER_TITLE" : "Calendrier des rendez vous",
	"DPC_MODAL_TITLE" : "Créer un nouveau rendez-vous",
	"DPC_MODAL_CREATE_BUTTON" : "Créer maintenant",
    "DPC_MODAL_BODY" : "Création en cours ...",

    "DPC_RECHERCHE_PAR_NOM":"Recherche par nom, prénom ...",
    "DPC_PATIENT":" Patient:",
    "DPC_PATIENT_NON_TROUVER":" Aucun patient n'a été trouvé",  
    "DPC_CREER_UN":"créer un ",
    "DPC_NOTE_OPTIONNEL":"Note: (optionnel): ",
    "DPC_CREER_MAINTENANT_RDV":"Créer maintenant ",
    "DPC_RETOUR":"Retour ",
    "DPC_CREER_PATIENT":"Créer le patient ",
	
	//edit appointment
	"DEPT_PAGE_TITLE" : "Modifier le renez-vous",
	"DEPT_BACK_TO_DORTOR_SPACE" : "Retour à l'espace medecins",
	"DEPT_CHDANGING_APPOINTMENT" : "Vous êtes sur le point de modifier votre rendez-vous",
	"DEPT_NO_SESSION_AVAILBLE" : "Vous êtes sur le point de modifier votre rendez-vous",
	"DEPT_EDIT_ERROR" : "Une erreur s'est produite.",
	"DEPT_EDIT_ATTENTE" : "Le changement de la date du rendez-vous mettre automatiquement le statut du rendez-vous en attente de confirmation",


	//My patients
	"PT_CONTAINER_TITLE" : "Mes patients",
	"PT_ADHERED" : "adhérés au Docteury.tn",
	"PT_PATIENTS_NONE" : "Vous n'avez aucun patient",
	"PT_NAME_LASTNAME" : "Nom et Prénom",
	"PT_SHOW_APPOINTMENTS" : "Afficher les rendez-vous",
	"PT_HIDE_APPOINTMENTS" : "Cacher les rendez-vous",
	"PT_SHOW_NOTES" : "Afficher les notes",
	"PT_HIDE_NOTES" : "Afficher les notes",
	"PT_SHOW_HIDE_SMS" : "Afficher/Envoyer SMS",
	"PT_HIDE_SMS" : "Cacher les SMS",
	"PT_SHOW_MEDICAL_FOLDER" : "Afficher le dossier medical",
	"PT_NO_NOTE_ADDED" : "Aucune note ajouté",
	"PT_SENT_AT" : "Eonvoyé le",
	"PT_SENT_SMS_TO" : "Envoyer un SMS à",
	"PT_SMS_SENDING" : "Envoi du SMS en cours ...",
	"PT_CHARS_REMAINING" : "caractère(s) restants",
	"PT_INVALID_SMS" : "Le message est invalide. Le message ne doit pas être vide ou contient plus que 100 caractères.",
	"PT_PATIENT_NO_MEDICAL" : "Ce patient n'a pas de dossier médical.",
	"PT_PATIENT_MEDICAL_ACCESS_REQUIRED" : "Ce patient n'a pas de dossier médical.",
	"PT_SEND_TO_DOCTOR" : "Recommander au médecin",
	"PT_NOTE_RDV" : "Note pour le rendez-vous du",
	"PT_MESSAGE" : "Message",
	"PT_SEND_TO" : " À ",
	"PT_FIND_DOCTOR" : "Trouver un médecin",
	"PT_RECHERCHE" : "Nom,Prenom ...",
	"PT_INVITE" : "Inviter",
	"PT_NO_DOCTOR" :"No doctor",
	"PT_INVITATION" :"Invitation",
	"PT_SHOW_CALENDAR" :"Afficher Calendrier",
	"PT_CLOSE_CALENDAR" :"Fermer Calendrier",
	
//Prametres docteur
    "PD_TITLE":"Espace docteur",
    "PD_PARAM":"Paramètres",
    "PD_DURE_SEANCE":" Durée de la séance",
    "PD_HORAIRE":" Horaires du travail",
    "PD_JOURS":"  Lundi, Mardi, Mercredi, Jeudi, Vendredi",
    "PD_DEBUT_MATINE":"Début matinée",
    "PD_FIN_MATINE":"Fin matinée",
    "PD_DEBUT_MIDI":"Début après-midi",
    "PD_FIN_MIDI":"Fin après-midi",
    "PD_SAMEDI":"Samedi",
    "PD_DEBUT_JOURNEE":" Début de la journée",
    "PD_FIN_DE_LA":"  Fin de la journée",
     

	//about page
	"TITLE_apropos_fr" :  "A propos de",


	//Inscription /Patient

	"US_TITLE" : "Patient ? Inscrivez-vous ",
     "US_COMPLETE" : "Compléter votre profil",

	"US_INSCRIPTION" : "Inscription",
	"US_SEXE" : "Sexe",
	"US_HOMME" : "Homme",
	"US_FEMME" : "Femme",
	"US_AUTRE" : "Autre",
	
	"UR_TITLE":"Sélectionner un title.",
	"UR_TEL":"Numéro de Téléphone",
	"UR_INSCRIPTIONB":"S'inscrire.",
	"UR_SANTE":"Simplifiez vous la santé !",
	"UR_RDV":"Prenez RDV en ligne 24h/24 et 7j/7",
	"UR_RDV1":"Plus d’appel, plus d’attente : prenez RDV avec votre praticien habituel quand vous voulez, en 1 clic",
	"UR_HORAIRE":"Trouvez l’horaire qui vous convient",
	"UR_VISUALISATION":"Visualisez en 1 clin d’œil tous les créneaux disponibles dans les jours à venir",
	"UR_INFO":"Des informations fiables",
	"UR_RENSEIGNEMENT":"Renseignez-vous sur les praticiens de votre quartier pour trouver celui qui vous convient",
	
	//Inscription /Doctor
    "UD_TITLE" : "Médecin ? Rejoignez-nous!- Docteury.tn",
    "UD_INSCRIPTION" : "Inscription Professionnel de Santé",
    "UD_MD" : "Le mot de passe doit contenir au moins 8 caractères",
    "UD_TITRE" : "Titre",
    "UD_DR" : "Dr.",
    "UD_PR" : "Pr. ",
    "UD_SELECTIONTITLE" : "Sélectionner un title.",
    "UD_BIO" : "Biographie ",
    "UD_NUM" : "Numéro de Téléphone ",
    "UD_NUMSMS" : "Numéro de notification pour les sms",
    "UD_SPECIALITY" : "Sélectionner au moins une spécialité.",
    "UD_SSPECIALITY" : "Sous spécialité",

    "UD_RUE" : "Rue",
    "UD_NUMERO" : "Numéro",
    "UD_COMPLEMENTAD" : "Complement d'adresse",
    "UD_BATIMENT" : "Batiment",
    "UD_ETAGE" : "Etage",
    "UD_PORTE" : "Porte",
    "UD_NAV" : "Naviguer à votre cabinet",
    "UD_CERTIF" : "Je certifie être un professionnel de santé",
     "UD_CASE" : "Case non cochée.",
     "UD_INSCRI" : "S'inscrire gratuitement",
     "UD_CERTIF" : "Je certifie être un professionnel de santé",
     "UD_SANTE":"Simplifier votre quotidien (Gratuit)",
     "UD_PRISERDV":"Prise de RDV sur Internet",
     "UD_PROPOSE":"Proposez à vos patients de prendre RDV en ligne 24h/24 et 7j/7",
     "UD_NOTIF":"Notification des nouveaux rendez-vous",
     "UD_AGENDAP":"Agenda personnalisable",

     "UD_GAGNER":"Gagnez du temps dans votre quotidien",
     "UD_APPEL":"50% d’appels en moins au cabinet",
     "UD_EMAILCONF":"Emails de confirmation illimités",
     "UD_SMS":"SMS de rappel illimités",
     "UD_VISIBILITY":"Maitrisez votre visibilité sur internet",
     
     "UD_PER":"Site internet dédié entièrement personnalisable",
     "UD_REF":"Référencement optimisé",

//doctorMedicalFolder

"DMF_DOSSIER_MEDICAL":"Dossier médical ",
"DMF_DOSSIER_MEDICAL_DU" :"Dossier medical du" ,
"DMF_AUTORISATION_MEDECIN":"Autoriser un médecin",
"DMF_NOM_MEDECIN ":"Nom du Médecin",
"DMF_MEDECIN_AUTORISER":"Les médecins qui sont déjà autorisent",
"DMF_DOSSIER_NON_PARTAGER":"Votre dossier n'est pas partagé avec aucun médecin ",
"DMF_DOSSIER_PARTAGER":"Votre dossier est partagé avec",
"DMF_MEDECIN":"médecin(s)",

//doctor profile
"DP_SPECIALITY" : " spécialité",
"DP_MODIFIER_PROFILE" : " Modifier votre profile",
"DP_PRENDRE_RDV" : " Prendre Rendez-vous",
"DP_AUCUNE_MAP":"Aucune map ",
"DP_CHOISIR_RDV":"Choisissez un rendez-vous ",
"DP_RETROACTION" : " Donner une rétroaction",
"DP_FEEDBACK" : " Feedback",

//Update profile doctor
"UPD_MODIFIER_INFO" :"Modifier mes informations",
"UPD_VERIFICATION" :"Veuillez vérifier les champs ci-dessous",
"UPD_NUM_NOTIF" :"Numéro de notification pour les sms",
"UPD_PHOTO" :"Photo",
"UPD_DR" :"Dr.",
"UPD_PR" :"Pr.",
"UPD_speciality" :"Choisir une spécialité *",
"UPD_PASSWORD_ACTUEL" :"Veuillez saisir votre mot de passe actuel",
"UPD_PASSWORD_NEW" :"Veuillez ressaisir votre nouveau mot de passe",
"UPD_PASSWORD_RENEW" :"Veuillez ré-entrez le nouveau mot de passe",
"UPD_PASSWORD_FAILURE" :"Le mot de passe ne correspond pas",
"UPD_CHOIX_VILLE" :"Choisir une ville",




 


};
english = {};
arabe = {
	"NOT_CONFIRMED" : "Non confirmé",
	"CONFIRMED" : "Confirmé",
	"CANCLED" : "Annulé",
	"CANCEL" : "Annuler",
	"CONFIRM" : "Confirmer",
	"WAITING_TO_CONFIRMATION" : "En attente de confirmation",
	"LOADING_WITH_POINT" : "Chargement ...",
	"BACK_TO_HOME" : "Aller à la page d'accueil",
	"UPDATE_BUTTON" : "Mettre à jour",
	"CHANGE_THE_DATE" : "Changer la date",	
	"EMAIL" : "E-mail",
	"TEL" : "Télephone",
	"ADDRESS" : "Adresse",
	"PASSWORD" : "Mot de passe",
	"OR" : "ou",
	"HERE" : "ici",
	"STATUS" : "Statut",
	"DORTOR_SPACE" : "فضاء الطبيب ",
	"MY_PATIENTS" : "مرضاي",
	"REPORT" : "Report",
	"REPORT" : "Report",
	"NEXT" : "Suivant",
	"PREV" : "Précédent",
	"CALENDAR" : "تقويم",
	"HELLO": "مرحبا",

	//Nav
	"PULICPROFILE": "الملف الشخصي العام",
	
};




module.exports = {
	fr : french,
	en : english,
	ar : arabe
}