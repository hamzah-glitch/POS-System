package com.posSystem.controller;


import com.posSystem.domain.StoreStatus;
import com.posSystem.exception.UserException;
import com.posSystem.mapper.StoreMapper;
import com.posSystem.models.User;
import com.posSystem.payload.dto.StoreDto;
import com.posSystem.payload.response.ApiResponse;
import com.posSystem.service.StoreService;
import com.posSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {

    private final StoreService storeService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<StoreDto> createStore(@RequestBody StoreDto storeDto,
                                                @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.getUserFromJwtToken(jwt);

        return ResponseEntity.ok(storeService.createdStore(storeDto, user));
        }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable Long id,
                                                @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(storeService.getStore(id));
    }

    @GetMapping
    public ResponseEntity<List<StoreDto>> getAllStore(@RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(storeService.getAllStoress());
    }

    @GetMapping("/admin")
    public ResponseEntity<StoreDto> getStoreByAdmin(
            @RequestHeader("Authorization") String jwt) throws Exception {
        return ResponseEntity.ok(StoreMapper.toDTO(storeService.getStoreAdmin()));

    }

    @GetMapping("/employee")
    public ResponseEntity<StoreDto> getStoreByEmployee(
            @RequestHeader("Authorization") String jwt) throws UserException {
        return ResponseEntity.ok(storeService.getStoreByEmployee());

    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<StoreDto> updateStore(
            @PathVariable Long id,
            @RequestBody StoreDto storeDto) throws Exception{
        return ResponseEntity.ok(storeService.updateStore(id, storeDto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<StoreDto> changeStatus(
            @PathVariable Long id,
            @RequestParam StoreStatus status) throws Exception{

        return ResponseEntity.ok(storeService.changeStoreStatus(id,status));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteStore(
            @PathVariable Long id) throws Exception{
        storeService.deleteStore(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("store deleted successfully.");
        return ResponseEntity.ok(apiResponse);
    }
}
