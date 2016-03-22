'use strict';

var googleConfig = {
  gcloud: require('gcloud')(googleConfigGetCredentials(process.env.NODE_ENV)),
};

function googleConfigGetCredentials(env) {
  var key = {
    projectId: 'stockmastergae',
    credentials: {
      private_key_id: '941e09eb63ca36b314265313fb6e95204240a0c8',
      private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCztmw958GeC8Xl\nZiVCjstpMiO3LDmSymx58dKSMx3xI3UJ3q1/Hfip3AsyZFW13kIKl8aSLNknxwYM\nh8B7FX+KbLYjl0/1Z59XAvcZyDheA+RMhR3mckK5rKlFMAgRk/BtJ74kGn6zrBvv\ndkT5lNInuJkHuJlvaD/cSL0bJRpARig2hvvGwiheLq41k+gwyL3yCmPwnvwA37zj\n2UIn9T3VQrfDzkrCywAu1n/xhTxLLtl5W+Z9UC6f5DywbcfTOjqH5hmTpwapPDK6\nOnX3gjeSGfFmwhYZD5PoObNawLybYvSD89NG/G05j4I9PQJyiW9PahJfCWbgqdRN\n4QMihxVLAgMBAAECggEAS+y+Pkkzm7oNmaVWCJCbj44HWNPuXv32Zm6sL+g4ti/s\nuobBdfsLm3fDoz6Ql42XCTKmSgt4kz2aaKDRyS6D+8+CA/dhaKSmxPQTwWi9p7qt\nMUbsIvgTCK7RtNFeF08RPIyV4FrxPKdyBfFJosglIXLz9DchW9gHYuG4Q0ehl5VW\n6Io3fQzx51XJmXWo1ARNKS6sZQwnrcTywhCuSCPpsQb9zEvSz/iTIQrmUKrH7xH7\nHKFIOYrDg8hwkTpZwV0mpKV+0qVJT4aX9mLQIut8w5o5faxVwxdBc927SIPqh32C\nB+D9ox1FGtYF48XHzN26yIib+NJKFWCrgfmp4zVUQQKBgQDgtu+w6hw5Bv0/Iskc\nOsFjx3nOA8tatTXTx3IjXPMlwEzOaz/Nfnc4R3n4kqTh4x0rM3S0UCjST/Z01xoQ\nP2L/hz2BzLq7Xr1HDUNuxNh1jj8yarO/HTRV46wElPcX7wXDjk3qKYqiCKZO4eh3\nSml5Ermn/Gu8OsDOwaJFSJCVJwKBgQDMu5Ff8wTrFbwv/Ijx5AHeJZLTuid3CuZW\nOLNNm0d1TwS3PWVMRAAFgNx/bFQINkWC8PLDkcuYPS240XWj8R+R+KHBfj/XHkOt\nf002obpnRBE2cT1szzU32YMc/+7k/j7G10stDYPEA+j41QvNCXOMQiGeEzD7bFah\n9rW4CXT9PQKBgGlWN7ulsn8lAJeU9dMO09KzEiz5aFzn7wiMSLu8+ZmrsBVe/vSU\nIMy37LwR+cqNjQHQSBeyL8COjUguAOC25fBEdBehYbMtcOqalA6bpaBNguBeVk3z\nIbJVXDB1p/KHMBuAXJO0z3CvP05g5Xjt381Kcs8FK3d7zx/ccvWpU2UnAoGAZiI0\nVb9wdq5zISVEVBfA7sejxcgaJALmAaFroY2TSmxPF/Ki9DcAI76zQUYTbb1VVAtL\nsFCtVpc+lfK4Uz7Y1wNH/rUyt+g7LvRQ2q43xYhpZdV8JSoBjIkQJYlv7gD/5EZH\nFISndUPWFzyBFJpgcFoVVzyPtP3JAieHY/YjzKkCgYBJujSiWLNU9dKExaX+GJt1\nJAnYMfh9oDsUSA0x7ZhZoQu00kimuWVF61z8aqP8y7isTKfhY3Hn0jDUZ1OjO3xX\nkhFuyZqamt3sb9/n+0LHLhGN1U3Pa7S788OtwEeAZ5hjKGLeYvebR4fGGXADXUdv\nUo086/M5cEsOZSpMV4k6Gg\u003d\u003d\n-----END PRIVATE KEY-----\n',
      client_email: '229716591308-7v9jf2fgte2cbc6dnml3ual5qts8iv9c@developer.gserviceaccount.com',
      client_id: '229716591308-7v9jf2fgte2cbc6dnml3ual5qts8iv9c.apps.googleusercontent.com',
      type: 'service_account',
    },
  };
  if (env) {

    switch (env.toLowerCase()) {
      case 'testing':
        key = {
          projectId: 'forexmastergaetest',
          credentials: {
            private_key_id: 'b82d986a03b22b1acec5484f9ce0d63ea7ed3ed4',
            private_key: '-----BEGIN PRIVATE KEY-----\nMIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMo632XQ++cHJfRh\nGTSNchDG6OLuyBIP9oU1T69VTD9tOhqMJZ/fI4iB0P44c0xoHdiXahYfsl8P7eTJ\nhaTSD9imFBVfLZdmJftzD6aMFJT5XngSZTSKXk7eyS3LMwWBEcXphmXLE5JJ+Hyn\nqwChwlEB5pLoavRHpVEYfPoVyq6tAgMBAAECgYEAoW4rhGA1pW8sWg7kivHaOxA9\nOWG47co2VJGA4YpqijsL5cM4CY2bFM3j4ft39mcqZApCUhTNU1so4LgJac+Re0ci\npqqst9jeQiirfIG2UTON8B/ef5AbofKrV+zaAw7vtIBYMfFv+7gv7ifu7hfiR010\nNY49qeGhCUUSVyMUeoECQQD/s/vF/+AJgvrjaAqXRIUe0uAxYUgcMmkwCL5nDaxI\nDZ4Kl/qZ46zkxXiVEqWEEhhffNY/UBJkSsoEDY8xua6NAkEAynb+EPkM8fWX65lk\nlgwf1hYxC11tX9AspU5SfVetjTB5Mw+LvXtx7dNfP22pG8IvIfe5i8/UyDSLmdAE\njq2IoQJAOv86+x8jgO5QlsF9mBM+J7N9+Ma6TY8wB94smDhmZKWHrmgMcQ8/5/TL\n8pE/0S4fo4B5Klh+Ndevrqm2PUHbTQJBAMclmix5vJj22JL+U6kfjeUX+O/T2vSG\noJOM4ai2qFgbWOu3m90qYlrrMWIDbHaIX7IKqDB0oji3LqWBrinlWWECQQDMhXE3\nKUytRkHN+zdECZFTuPmtnZsMqsCbjU4MFcc1JKSIkx9siw2M5gJJwu4+AbAtI+xu\nVlTQ2JvmPgpIboaL\n-----END PRIVATE KEY-----\n',
            client_email: '581384470278-7slaf5e0m9dlodlcn95ldrbcapo4jr0h@developer.gserviceaccount.com',
            client_id: '581384470278-7slaf5e0m9dlodlcn95ldrbcapo4jr0h.apps.googleusercontent.com',
            type: 'service_account',
          },
        };
        break;
      case 'production':
        key = {
          projectId: 'forexmastergae',
          credentials: {
            private_key_id: '5c5224d3fac97f242e3ccb3cda654d15f8f84cb1',
            private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeKlyAMC/2OZgb\nqkgnQrN+HE5maGnP+sH1L/9BpwFaYTEzA9luE4HQvwRCEPDtb4feYr0UHD1qwX2K\nAMEOO0vxAHCFZqAnWL78HAXWnrEm8IJcfER6naNq9T94asVZuXdYruatpcPqz/8m\nq64iw5fs71aEmVvprzDTWYRmiQy9qoqWP4dQ6nPk9yazbMDLXCsOwOfxsMxGqYDT\nCQff5PxVZMq4yNv6y/RXtXKBCRF0v7xS3yggm9JZ7XqrAXhcqf7LPKC2Q+o5f5uA\nu4Szy3TuGJXtMovfE/iK+mi7+MaIWJHU/efwVnwpZEIwQPVtYeEnG+CX3nVYbxD4\n7ySihBKXAgMBAAECggEAZrOFCuu/SPfO8C/a2Dt0h6/jrJWiF51w8j+vVLcXptMz\nejfGqLZb9esC3c9YUiS4qcudkQBhVP+8/65LrW0Ne7lYVxbzaXkz0kpz9A9pYqqL\nS3iZkrDnmx0SkKNr8D4A5AH14c2gcMmMmVSjJwmwjfY/TKy0RQIwBxy6X0Ygksqz\n1BphYch9Aa2gUb1xXon89QUgQwNfzunbrDGdJ6LxaUB4l7swwhbtYmSt5iz6GJgp\nC7SKF8vzT1uV2KrZtMc6ddqWWNyihRFqwvNGpUAUZWzPqxcfIeVSmlIk2oK2qb4d\nWnYR0xb9v9ylb4JxyhhatV/pKldBettK8Y11Ln69KQKBgQDRyAKtaBn5ehtuLoME\ne0nJb1D62E7jkX+Ds55Blf/O1GiyePiGoZipnlBs9x7Y0wPsRDJuZEuRa8soEUer\ny65tQ7p3Sbg/lnRTv2w6uZ1L0prBWFn3WC4aOYaKQ8EwHmqXMB5M9xntmOTLUH8W\n3hIoCeWuls4lFIN4/Khp82F2YwKBgQDBAyOO38Lul6v5TPAeHeqYowEJSDYRPXJa\nyZzgqosoadGeVT5BkrBO6MMfyUqiSGkLVM2AIgDc+5eIPcn6rFlErX3XX2CRRTFc\naTV73mIaRon4OCN+LzKaLhNW3uun4XnO911kkn6oquqrTOI1TbiMcub6DNof8jjJ\n9xaa2V2/PQKBgFe8L6p4XEyjTe+R0kfAjEaLoLGYX737LvpU174UTs0gtrzVrRMZ\naHCf/oDkBWmnLv/UMcdLePNTwr56I6Bs6gFWjxiuozks4m/YIhqZYHjCluh/2/h/\nT6C2KFeRKK3IOsoKXNHRkm11QVLq0owsyikmooGXHpYRcz7ZZFITcNKDAoGBAI0f\nbGpUtUSaZUWcuZxrp1H/LQzKXa3xTaGP9EJYr/LWnEu2bBSp2nt3uOOO3CEX7KY6\nVR8wvYzV8A/PjdTZG1QZvf8xX3wYKWU2D8MH8JbhqJNzCJCEle0hb0Z/K7LOK6/m\nMcUNT8qnXXnudx8eOqeGg9ekegANrPQO09pYwDDJAoGAZwelF0/HjAo3udVxVaHD\n9OiuCOmiyJvcg/vBTB4VHu/usxAG6LcyNNGJaVLvi0LKJEjC1PTfmdaNEh7DCxD8\ntMgYErnvikfoHlD/gA3opFX8JduXfAbnxLI4m63qxUiXctksSfr2+ieibryed5RU\n7FZLDeW6UVMe4xJ8h9Ifl2o\u003d\n-----END PRIVATE KEY-----\n',
            client_email: '479157167438-sebjt5cqcgebf68erjfj2eftqnomig24@developer.gserviceaccount.com',
            client_id: '479157167438-sebjt5cqcgebf68erjfj2eftqnomig24.apps.googleusercontent.com',
            type: 'service_account',
          },
        };
        break;
    }
  }

  return key;
}

module.exports = googleConfig;
