async function getWhopDetails() {
    const url = 'https://api.whop.com/api/v2/companies/me';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer apik_iEPTP1jOxPnIH_C3649277_C_5013107f3c3a63fbdce84f68d564a9c4c00f980f2d9627d533573ea2e7d151'
        }
    };

    try {
        const plansUrl = 'https://api.whop.com/api/v2/plans';
        const plansRes = await fetch(plansUrl, options);
        const plansData = await plansRes.json();
        console.log("Plans IDs:");
        plansData.data.forEach(p => console.log(p.id));

    } catch (err) {
        console.error(err);
    }
}

getWhopDetails();
