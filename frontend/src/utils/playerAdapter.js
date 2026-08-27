/**
 * Transforms a raw API PlayerResponseDTO into the shape expected by the frontend PlayerCard component.
 *
 * @param {Object} dto - The raw player object from the backend API.
 * @returns {Object} A fully-formed player object for the frontend.
 */
export const adaptPlayerFromApi = (dto) => {
    return {
        id: dto.id,
        // If we want Option A, we use lastName, but if it's missing, fallback to firstName + lastName
        name: dto.lastName || dto.firstName, 
        firstName: dto.firstName,
        lastName: dto.lastName,
        position: dto.position,
        overallRating: dto.overallRating,
        photoUrl: dto.playerImageUrl === "placeholder_url_test" ? "" : (dto.playerImageUrl || ""),
        stats: {
            pac: dto.pace || 0,
            sho: dto.shooting || 0,
            pas: dto.passing || 0,
            dri: dto.dribbling || 0,
            def: dto.defending || 0,
            phy: dto.physicality || 0
        },
        nation: {
            name: dto.nationName,
            flagUrl: "" // Backend enhancement deferred
        },
        club: {
            name: dto.clubName,
            crestUrl: "" // Backend enhancement deferred
        },
        league: {
            name: dto.leagueName,
            crestUrl: ""
        },
        cardType: dto.cardType || "BASE"
    };
};
