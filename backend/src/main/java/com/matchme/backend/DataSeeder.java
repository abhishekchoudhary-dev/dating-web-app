package com.matchme.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.matchme.backend.auth.dto.AuthService;
import com.matchme.backend.auth.dto.RegisterRequest;
import com.matchme.backend.user.UserRepository;
import com.matchme.backend.user.UserService;
import com.matchme.backend.user.bio.enums.Gender;
import com.matchme.backend.user.bio.enums.GenderPreference;
import com.matchme.backend.user.bio.enums.Interest;
import com.matchme.backend.user.bio.enums.Language;
import com.matchme.backend.user.dto.UserFullProfileRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository;
    //avoid injection
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(ApplicationArguments args) {
        seedUsers();
    }

    @SuppressWarnings("unchecked")
    public void seedUsers() {

        String[] maleNames = {
            "James", "Oliver", "Harry", "Jack", "George",
            "Noah", "Charlie", "Jacob", "Alfie", "Freddie",
            "Oscar", "Henry", "Leo", "Archie", "Ethan",
            "Lucas", "Mason", "Logan", "Elijah", "Liam"
        };

        String[] femaleNames = {
            "Olivia", "Emma", "Amelia", "Sophia", "Isabella",
            "Mia", "Charlotte", "Ava", "Emily", "Aria",
            "Luna", "Chloe", "Layla", "Penelope", "Riley",
            "Zoey", "Nora", "Lily", "Eleanor", "Hannah"
        };

        String[] locations = {
            "London", "Manchester", "Birmingham", "Leeds", "Glasgow",
            "Liverpool", "Bristol", "Edinburgh", "Sheffield", "Newcastle","Tallinn",
            "Riga","Vilnius","Helsinki"
        };

        String[] aboutMeTexts = {
            "Adventure seeker and coffee lover. Looking for someone to explore the world with.",
            "Software engineer by day, guitarist by night. Love good food and great company.",
            "Fitness enthusiast who loves hiking and cooking. Looking for my partner in crime.",
            "Avid reader and film buff. Always up for a good debate or a quiet evening in.",
            "Traveller at heart. Been to 30 countries and counting. Looking for a travel buddy.",
            "Dog lover and brunch enthusiast. Looking for someone genuine and kind.",
            "Yoga lover and foodie. Life is too short for bad coffee and boring people.",
            "Book worm and film lover. Looking for my person to binge watch shows with.",
            "Outdoor enthusiast who loves hiking and photography. Seeking a genuine connection.",
            "Teacher who loves art and music. Seeking someone to share adventures with."
        };

        List<Interest>[] interestsList = new List[]{
            List.of(Interest.MUSIC, Interest.GAMING, Interest.TRAVEL),
            List.of(Interest.FITNESS, Interest.COOKING, Interest.SPORTS),
            List.of(Interest.TECHNOLOGY, Interest.GAMING, Interest.MOVIES),
            List.of(Interest.HIKING, Interest.PHOTOGRAPHY, Interest.TRAVEL),
            List.of(Interest.COOKING, Interest.READING, Interest.MUSIC),
            List.of(Interest.SPORTS, Interest.FITNESS, Interest.FOOD),
            List.of(Interest.ART, Interest.MUSIC, Interest.DANCING),
            List.of(Interest.TRAVEL, Interest.PHOTOGRAPHY, Interest.FOOD),
            List.of(Interest.READING, Interest.MOVIES, Interest.COOKING),
            List.of(Interest.GAMING, Interest.TECHNOLOGY, Interest.MUSIC)
        };

        List<Language>[] languagesList = new List[]{
            List.of(Language.ENGLISH),
            List.of(Language.ENGLISH, Language.FRENCH),
            List.of(Language.ENGLISH, Language.SPANISH),
            List.of(Language.ENGLISH, Language.HINDI),
            List.of(Language.ENGLISH, Language.GERMAN),
            List.of(Language.ENGLISH, Language.FRENCH, Language.SPANISH),
            List.of(Language.ENGLISH, Language.MANDARIN),
            List.of(Language.ENGLISH, Language.ARABIC),
            List.of(Language.ENGLISH, Language.PORTUGUESE),
            List.of(Language.ENGLISH, Language.RUSSIAN)
        };

        // Generate 50 male users
        for (int i = 0; i < 50; i++) {
            String name = maleNames[i % maleNames.length] + (i >= maleNames.length ? i : "");
            String email = name.toLowerCase() + "@test.com";
            int age = 20 + (i % 25);
            String location = locations[i % locations.length];
            String aboutMe = aboutMeTexts[i % aboutMeTexts.length];
            List<Interest> interests = interestsList[i % interestsList.length];
            List<Language> languages = languagesList[i % languagesList.length];

            seedUser(email, "password", name, age, Gender.MALE, location, aboutMe,
                    interests, languages, GenderPreference.FEMALE, 18, 40, 50);
        }

        // Generate 50 female users
        for (int i = 0; i < 50; i++) {
            String name = femaleNames[i % femaleNames.length] + (i >= femaleNames.length ? i : "");
            String email = name.toLowerCase() + "@test.com";
            int age = 20 + (i % 25);
            String location = locations[i % locations.length];
            String aboutMe = aboutMeTexts[i % aboutMeTexts.length];
            List<Interest> interests = interestsList[i % interestsList.length];
            List<Language> languages = languagesList[i % languagesList.length];

            seedUser(email, "password", name, age, Gender.FEMALE, location, aboutMe,
                    interests, languages, GenderPreference.MALE, 18, 40, 50);
        }

        log.info("Seeder: done");
    }

    private void seedUser(
            String email, String password, String name, int age,
            Gender gender, String location, String aboutMe,
            List<Interest> interests, List<Language> languages,
            GenderPreference preferenceGender, int preferenceAgeMin,
            int preferenceAgeMax, int preferenceDistanceRadius) {
        try {
            // Skip if user is already existng
            if (userRepository.findByEmail(email).isPresent()) {
                log.info("Seeder: skipping {} — already exists", email);
                return;
            }

            // Register — creates User with empty user profile and bio
            authService.register(new RegisterRequest(email, password));

            // Find saved user
            var user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found after seeding"));

            // Build profile request via ObjectMapper
            Map<String, Object> requestMap = Map.of(
                "user", Map.of(
                    "name", name
                ),
                "profile", Map.of(
                    "aboutMe", aboutMe
                ),
                "bio", Map.of(
                    "age", age,
                    "gender", gender.name(),
                    "location", location,
                    "interests", interests.stream().map(Enum::name).toList(),
                    "languages", languages.stream().map(Enum::name).toList(),
                    "preferenceGender", preferenceGender.name(),
                    "preferenceAgeMin", preferenceAgeMin,
                    "preferenceAgeMax", preferenceAgeMax,
                    "preferenceDistanceRadius", preferenceDistanceRadius
                )
            );

            UserFullProfileRequest profileRequest = objectMapper
                    .convertValue(requestMap, UserFullProfileRequest.class);

            // Save full profile
            userService.putMe(user.getId(), profileRequest);

            log.info("Seeder: created user {}", email);

        } catch (Exception e) {
            log.error("Seeder: failed to create {} — {}", email, e.getMessage());
        }
    }
}