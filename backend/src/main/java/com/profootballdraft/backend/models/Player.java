package com.profootballdraft.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "players",
    indexes = {
        @Index(name = "idx_players_overall_rating", columnList = "overall_rating"),
        @Index(name = "idx_players_position", columnList = "position"),
        @Index(name = "idx_players_club_id", columnList = "club_id"),
        @Index(name = "idx_players_nation_id", columnList = "nation_id")
    }
)
@Data
@NoArgsConstructor
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 10)
    private String position;

    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;

    private Integer pace;
    private Integer shooting;
    private Integer passing;
    private Integer dribbling;
    private Integer defending;
    private Integer physicality;

    @Column(name = "player_image_url")
    private String playerImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_type", length = 20)
    private CardType cardType = CardType.BASE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nation_id")
    private Nation nation;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
