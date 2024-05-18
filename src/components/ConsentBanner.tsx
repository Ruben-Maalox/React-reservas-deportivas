import CookieConsent from 'react-cookie-consent'; // npm install react-cookie-consent

export const ConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Aceptar"
      cookieName="bestCookieInTheWorld"
      style={{ background: '#606078' }} //color sacado de la paleta de colores que elegimos
      buttonStyle={{ color: '#4e503b', borderRadius: '5px', fontWeight: 'bold' }}
      expires={150} //numero de días antes de que la cookie expire
      enableDeclineButton
      declineButtonText="Rechazar"
      declineButtonStyle={{ borderRadius: '5px', fontWeight: 'bold' }}
      contentStyle={{
        textAlign: 'center',
        padding: '10px',
        maxWidth: '600px',
        margin: 'auto',
        fontFamily: 'Arial',
        letterSpacing: '0.5px',
      }}
    >
      Este sitio web utiliza cookies para mejorar la experiencia del usuario.
    </CookieConsent>
  );
};
