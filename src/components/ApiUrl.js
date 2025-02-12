// //JJ TEST - Production
// // const API_URL = 'http://192.168.1.9:8084';

// // JJ_LIVE - Production
// // const API_URL = 'http://192.168.1.13:8082';

// // // JJ_LIVE - Production - Static Ip
// const API_URL = 'http://202.65.171.162:8082';

// //AVPL_TEST- Production
// // const API_URL = 'http://192.168.0.196:8080';

// //AVPL_LIVE- Production
// // const API_URL = 'http://103.44.97.154:8080';

// //Demo Application support
// // const API_URL = 'http://103.44.98.58:8083';

// //IMS
// // const API_URL = 'http://103.44.98.58:8081';

// //Dev - Surya
// // const API_URL = 'http://192.168.0.107:8084';
// // const API_URL = 'http://192.168.0.107:8087';
// // const API_URL = 'http://192.168.0.107:8085';

// // const API_URL = 'http://192.168.0.207:8001';
// //Dev Harish
// // const API_URL = 'http://192.168.0.169:8084';

// //Testing Local- Ravi bro
// // const API_URL = 'http://192.168.0.84:8087';

// //Testing Local- Ravi bro alternative port
// // const API_URL = 'http://192.168.0.84:8090';

// //Testing Public Ip- Ravi bro
// // const API_URL = 'http://103.44.98.58:8087';

// export {API_URL};
import {ENVIRONMENT} from '@env';

let API_URL = null;
let CompanyName = null;
let logo = null;
let pass = null;

// Assign the appropriate URL based on the selected environment
switch (ENVIRONMENT) {
  case 'JJ_MILLS':
    API_URL = 'http://192.168.1.13:8082';
    CompanyName = 'Jay Jay Mills (Bangladesh) Private Limited';
    logo = 'jjmills';
    pass = '';
    break;

  case 'JJ_MILLS_PROD':
    API_URL = 'http://202.65.171.162:8082';
    CompanyName = 'Jay Jay Mills (Bangladesh) Private Limited';
    logo = 'jjmills';
    pass = '';
    break;

  case 'AV_TEST':
    API_URL = 'http://192.168.0.196:8080';
    CompanyName = 'ADISHTAM VENTURES';
    logo = 'av';
    pass = '';
    break;

  case 'Test':
    // API_URL = 'http://192.168.0.169:8084'; // Harish
    API_URL = 'http://192.168.0.107:8085'; // Corrected the IP address
    // API_URL = 'http://192.168.0.207:8087'; // Corrected the IP address
    // CompanyName = 'ADISHTAM VENTURES';
    // API_URL = 'http://192.168.0.84:8089'; // Corrected the IP address
    // logo = 'av';
    CompanyName = 'Jay Jay Mills (Bangladesh) Private Limited';
    logo = 'jjmills';
    pass = 'hdplqa';
    break;

  default:
    API_URL = 'http://192.168.0.10:8080'; // Corrected the port
    console.warn("Unknown environment, defaulting to Dev - Surya's API URL");
    break;
}

// Ensure variables are properly assigned
if (!API_URL || !CompanyName || !logo) {
  console.error(
    'Configuration error: Missing required values for the environment',
  );
}

export {API_URL, CompanyName, logo, pass};
