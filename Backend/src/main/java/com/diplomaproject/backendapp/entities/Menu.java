package com.diplomaproject.backendapp.entities;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "content",columnDefinition = "LONGTEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    public Menu() {
    }
    public Menu(User user,String content){
        this.user = user;
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Menu menu = (Menu) o;
        return Objects.equals(id, menu.id) && Objects.equals(content, menu.content) && Objects.equals(user, menu.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, content, user);
    }

    @Override
    public String toString() {
        return "Menu{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", user=" + user +
                '}';
    }
}
