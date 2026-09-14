// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_user_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupUserSummary extends TopupUserSummary {
  @override
  final int userId;
  @override
  final String userEmail;
  @override
  final String userDisplayName;
  @override
  final int totalAmountRupiah;
  @override
  final int totalCreditsGranted;
  @override
  final int requestCount;
  @override
  final DateTime lastApprovedAt;

  factory _$TopupUserSummary(
          [void Function(TopupUserSummaryBuilder)? updates]) =>
      (TopupUserSummaryBuilder()..update(updates))._build();

  _$TopupUserSummary._(
      {required this.userId,
      required this.userEmail,
      required this.userDisplayName,
      required this.totalAmountRupiah,
      required this.totalCreditsGranted,
      required this.requestCount,
      required this.lastApprovedAt})
      : super._();
  @override
  TopupUserSummary rebuild(void Function(TopupUserSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupUserSummaryBuilder toBuilder() =>
      TopupUserSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupUserSummary &&
        userId == other.userId &&
        userEmail == other.userEmail &&
        userDisplayName == other.userDisplayName &&
        totalAmountRupiah == other.totalAmountRupiah &&
        totalCreditsGranted == other.totalCreditsGranted &&
        requestCount == other.requestCount &&
        lastApprovedAt == other.lastApprovedAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, userEmail.hashCode);
    _$hash = $jc(_$hash, userDisplayName.hashCode);
    _$hash = $jc(_$hash, totalAmountRupiah.hashCode);
    _$hash = $jc(_$hash, totalCreditsGranted.hashCode);
    _$hash = $jc(_$hash, requestCount.hashCode);
    _$hash = $jc(_$hash, lastApprovedAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupUserSummary')
          ..add('userId', userId)
          ..add('userEmail', userEmail)
          ..add('userDisplayName', userDisplayName)
          ..add('totalAmountRupiah', totalAmountRupiah)
          ..add('totalCreditsGranted', totalCreditsGranted)
          ..add('requestCount', requestCount)
          ..add('lastApprovedAt', lastApprovedAt))
        .toString();
  }
}

class TopupUserSummaryBuilder
    implements Builder<TopupUserSummary, TopupUserSummaryBuilder> {
  _$TopupUserSummary? _$v;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(int? userId) => _$this._userId = userId;

  String? _userEmail;
  String? get userEmail => _$this._userEmail;
  set userEmail(String? userEmail) => _$this._userEmail = userEmail;

  String? _userDisplayName;
  String? get userDisplayName => _$this._userDisplayName;
  set userDisplayName(String? userDisplayName) =>
      _$this._userDisplayName = userDisplayName;

  int? _totalAmountRupiah;
  int? get totalAmountRupiah => _$this._totalAmountRupiah;
  set totalAmountRupiah(int? totalAmountRupiah) =>
      _$this._totalAmountRupiah = totalAmountRupiah;

  int? _totalCreditsGranted;
  int? get totalCreditsGranted => _$this._totalCreditsGranted;
  set totalCreditsGranted(int? totalCreditsGranted) =>
      _$this._totalCreditsGranted = totalCreditsGranted;

  int? _requestCount;
  int? get requestCount => _$this._requestCount;
  set requestCount(int? requestCount) => _$this._requestCount = requestCount;

  DateTime? _lastApprovedAt;
  DateTime? get lastApprovedAt => _$this._lastApprovedAt;
  set lastApprovedAt(DateTime? lastApprovedAt) =>
      _$this._lastApprovedAt = lastApprovedAt;

  TopupUserSummaryBuilder() {
    TopupUserSummary._defaults(this);
  }

  TopupUserSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _userId = $v.userId;
      _userEmail = $v.userEmail;
      _userDisplayName = $v.userDisplayName;
      _totalAmountRupiah = $v.totalAmountRupiah;
      _totalCreditsGranted = $v.totalCreditsGranted;
      _requestCount = $v.requestCount;
      _lastApprovedAt = $v.lastApprovedAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupUserSummary other) {
    _$v = other as _$TopupUserSummary;
  }

  @override
  void update(void Function(TopupUserSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupUserSummary build() => _build();

  _$TopupUserSummary _build() {
    final _$result = _$v ??
        _$TopupUserSummary._(
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'TopupUserSummary', 'userId'),
          userEmail: BuiltValueNullFieldError.checkNotNull(
              userEmail, r'TopupUserSummary', 'userEmail'),
          userDisplayName: BuiltValueNullFieldError.checkNotNull(
              userDisplayName, r'TopupUserSummary', 'userDisplayName'),
          totalAmountRupiah: BuiltValueNullFieldError.checkNotNull(
              totalAmountRupiah, r'TopupUserSummary', 'totalAmountRupiah'),
          totalCreditsGranted: BuiltValueNullFieldError.checkNotNull(
              totalCreditsGranted, r'TopupUserSummary', 'totalCreditsGranted'),
          requestCount: BuiltValueNullFieldError.checkNotNull(
              requestCount, r'TopupUserSummary', 'requestCount'),
          lastApprovedAt: BuiltValueNullFieldError.checkNotNull(
              lastApprovedAt, r'TopupUserSummary', 'lastApprovedAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
