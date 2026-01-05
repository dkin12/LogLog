package com.example.loglog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class GrassResponse {

    private LocalDate date;
    private long count;
}
