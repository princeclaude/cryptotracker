// utils/santimentApi.js
import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://api.santiment.net/graphql", {
  headers: {
    Authorization: "Apikey kzgr4harua3r376v_uzkxv64ienlqaoyi",
  },
});

export const fetchSocialMetrics = async (slug) => {
  const query = gql`
    query getSocialMetrics($slug: String!) {
      getMetric(metric: "social_volume_total") {
        timeseriesData(
          slug: $slug
          from: "utc_now-7d"
          to: "utc_now"
          interval: "1d"
        ) {
          datetime
          value
        }
      }
    }
  `;
  const variables = { slug };
  const data = await client.request(query, variables);
  return data;
};
