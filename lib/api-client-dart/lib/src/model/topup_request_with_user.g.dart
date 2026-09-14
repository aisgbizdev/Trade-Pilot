// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_request_with_user.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupRequestWithUser extends TopupRequestWithUser {
  @override
  final String userDisplayName;
  @override
  final String userEmail;
  @override
  final int id;
  @override
  final int userId;
  @override
  final int amountRupiah;
  @override
  final int creditsRequested;
  @override
  final int conversionRateSnapshot;
  @override
  final String paymentReferenceNote;
  @override
  final String proofObjectPath;
  @override
  final TopupRequestStatus status;
  @override
  final int reviewedByUserId;
  @override
  final DateTime reviewedAt;
  @override
  final String reviewNote;
  @override
  final int creditsGranted;
  @override
  final DateTime createdAt;

  factory _$TopupRequestWithUser(
          [void Function(TopupRequestWithUserBuilder)? updates]) =>
      (TopupRequestWithUserBuilder()..update(updates))._build();

  _$TopupRequestWithUser._(
      {required this.userDisplayName,
      required this.userEmail,
      required this.id,
      required this.userId,
      required this.amountRupiah,
      required this.creditsRequested,
      required this.conversionRateSnapshot,
      required this.paymentReferenceNote,
      required this.proofObjectPath,
      required this.status,
      required this.reviewedByUserId,
      required this.reviewedAt,
      required this.reviewNote,
      required this.creditsGranted,
      required this.createdAt})
      : super._();
  @override
  TopupRequestWithUser rebuild(
          void Function(TopupRequestWithUserBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupRequestWithUserBuilder toBuilder() =>
      TopupRequestWithUserBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupRequestWithUser &&
        userDisplayName == other.userDisplayName &&
        userEmail == other.userEmail &&
        id == other.id &&
        userId == other.userId &&
        amountRupiah == other.amountRupiah &&
        creditsRequested == other.creditsRequested &&
        conversionRateSnapshot == other.conversionRateSnapshot &&
        paymentReferenceNote == other.paymentReferenceNote &&
        proofObjectPath == other.proofObjectPath &&
        status == other.status &&
        reviewedByUserId == other.reviewedByUserId &&
        reviewedAt == other.reviewedAt &&
        reviewNote == other.reviewNote &&
        creditsGranted == other.creditsGranted &&
        createdAt == other.createdAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, userDisplayName.hashCode);
    _$hash = $jc(_$hash, userEmail.hashCode);
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, userId.hashCode);
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, creditsRequested.hashCode);
    _$hash = $jc(_$hash, conversionRateSnapshot.hashCode);
    _$hash = $jc(_$hash, paymentReferenceNote.hashCode);
    _$hash = $jc(_$hash, proofObjectPath.hashCode);
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, reviewedByUserId.hashCode);
    _$hash = $jc(_$hash, reviewedAt.hashCode);
    _$hash = $jc(_$hash, reviewNote.hashCode);
    _$hash = $jc(_$hash, creditsGranted.hashCode);
    _$hash = $jc(_$hash, createdAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupRequestWithUser')
          ..add('userDisplayName', userDisplayName)
          ..add('userEmail', userEmail)
          ..add('id', id)
          ..add('userId', userId)
          ..add('amountRupiah', amountRupiah)
          ..add('creditsRequested', creditsRequested)
          ..add('conversionRateSnapshot', conversionRateSnapshot)
          ..add('paymentReferenceNote', paymentReferenceNote)
          ..add('proofObjectPath', proofObjectPath)
          ..add('status', status)
          ..add('reviewedByUserId', reviewedByUserId)
          ..add('reviewedAt', reviewedAt)
          ..add('reviewNote', reviewNote)
          ..add('creditsGranted', creditsGranted)
          ..add('createdAt', createdAt))
        .toString();
  }
}

class TopupRequestWithUserBuilder
    implements
        Builder<TopupRequestWithUser, TopupRequestWithUserBuilder>,
        TopupRequestBuilder {
  _$TopupRequestWithUser? _$v;

  String? _userDisplayName;
  String? get userDisplayName => _$this._userDisplayName;
  set userDisplayName(covariant String? userDisplayName) =>
      _$this._userDisplayName = userDisplayName;

  String? _userEmail;
  String? get userEmail => _$this._userEmail;
  set userEmail(covariant String? userEmail) => _$this._userEmail = userEmail;

  int? _id;
  int? get id => _$this._id;
  set id(covariant int? id) => _$this._id = id;

  int? _userId;
  int? get userId => _$this._userId;
  set userId(covariant int? userId) => _$this._userId = userId;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(covariant int? amountRupiah) =>
      _$this._amountRupiah = amountRupiah;

  int? _creditsRequested;
  int? get creditsRequested => _$this._creditsRequested;
  set creditsRequested(covariant int? creditsRequested) =>
      _$this._creditsRequested = creditsRequested;

  int? _conversionRateSnapshot;
  int? get conversionRateSnapshot => _$this._conversionRateSnapshot;
  set conversionRateSnapshot(covariant int? conversionRateSnapshot) =>
      _$this._conversionRateSnapshot = conversionRateSnapshot;

  String? _paymentReferenceNote;
  String? get paymentReferenceNote => _$this._paymentReferenceNote;
  set paymentReferenceNote(covariant String? paymentReferenceNote) =>
      _$this._paymentReferenceNote = paymentReferenceNote;

  String? _proofObjectPath;
  String? get proofObjectPath => _$this._proofObjectPath;
  set proofObjectPath(covariant String? proofObjectPath) =>
      _$this._proofObjectPath = proofObjectPath;

  TopupRequestStatus? _status;
  TopupRequestStatus? get status => _$this._status;
  set status(covariant TopupRequestStatus? status) => _$this._status = status;

  int? _reviewedByUserId;
  int? get reviewedByUserId => _$this._reviewedByUserId;
  set reviewedByUserId(covariant int? reviewedByUserId) =>
      _$this._reviewedByUserId = reviewedByUserId;

  DateTime? _reviewedAt;
  DateTime? get reviewedAt => _$this._reviewedAt;
  set reviewedAt(covariant DateTime? reviewedAt) =>
      _$this._reviewedAt = reviewedAt;

  String? _reviewNote;
  String? get reviewNote => _$this._reviewNote;
  set reviewNote(covariant String? reviewNote) =>
      _$this._reviewNote = reviewNote;

  int? _creditsGranted;
  int? get creditsGranted => _$this._creditsGranted;
  set creditsGranted(covariant int? creditsGranted) =>
      _$this._creditsGranted = creditsGranted;

  DateTime? _createdAt;
  DateTime? get createdAt => _$this._createdAt;
  set createdAt(covariant DateTime? createdAt) => _$this._createdAt = createdAt;

  TopupRequestWithUserBuilder() {
    TopupRequestWithUser._defaults(this);
  }

  TopupRequestWithUserBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _userDisplayName = $v.userDisplayName;
      _userEmail = $v.userEmail;
      _id = $v.id;
      _userId = $v.userId;
      _amountRupiah = $v.amountRupiah;
      _creditsRequested = $v.creditsRequested;
      _conversionRateSnapshot = $v.conversionRateSnapshot;
      _paymentReferenceNote = $v.paymentReferenceNote;
      _proofObjectPath = $v.proofObjectPath;
      _status = $v.status;
      _reviewedByUserId = $v.reviewedByUserId;
      _reviewedAt = $v.reviewedAt;
      _reviewNote = $v.reviewNote;
      _creditsGranted = $v.creditsGranted;
      _createdAt = $v.createdAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(covariant TopupRequestWithUser other) {
    _$v = other as _$TopupRequestWithUser;
  }

  @override
  void update(void Function(TopupRequestWithUserBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupRequestWithUser build() => _build();

  _$TopupRequestWithUser _build() {
    final _$result = _$v ??
        _$TopupRequestWithUser._(
          userDisplayName: BuiltValueNullFieldError.checkNotNull(
              userDisplayName, r'TopupRequestWithUser', 'userDisplayName'),
          userEmail: BuiltValueNullFieldError.checkNotNull(
              userEmail, r'TopupRequestWithUser', 'userEmail'),
          id: BuiltValueNullFieldError.checkNotNull(
              id, r'TopupRequestWithUser', 'id'),
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'TopupRequestWithUser', 'userId'),
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'TopupRequestWithUser', 'amountRupiah'),
          creditsRequested: BuiltValueNullFieldError.checkNotNull(
              creditsRequested, r'TopupRequestWithUser', 'creditsRequested'),
          conversionRateSnapshot: BuiltValueNullFieldError.checkNotNull(
              conversionRateSnapshot,
              r'TopupRequestWithUser',
              'conversionRateSnapshot'),
          paymentReferenceNote: BuiltValueNullFieldError.checkNotNull(
              paymentReferenceNote,
              r'TopupRequestWithUser',
              'paymentReferenceNote'),
          proofObjectPath: BuiltValueNullFieldError.checkNotNull(
              proofObjectPath, r'TopupRequestWithUser', 'proofObjectPath'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'TopupRequestWithUser', 'status'),
          reviewedByUserId: BuiltValueNullFieldError.checkNotNull(
              reviewedByUserId, r'TopupRequestWithUser', 'reviewedByUserId'),
          reviewedAt: BuiltValueNullFieldError.checkNotNull(
              reviewedAt, r'TopupRequestWithUser', 'reviewedAt'),
          reviewNote: BuiltValueNullFieldError.checkNotNull(
              reviewNote, r'TopupRequestWithUser', 'reviewNote'),
          creditsGranted: BuiltValueNullFieldError.checkNotNull(
              creditsGranted, r'TopupRequestWithUser', 'creditsGranted'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'TopupRequestWithUser', 'createdAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
