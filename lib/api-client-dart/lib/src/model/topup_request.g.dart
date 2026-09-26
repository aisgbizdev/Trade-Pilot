// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_request.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TopupRequestPaymentProviderEnum _$topupRequestPaymentProviderEnum_manual =
    const TopupRequestPaymentProviderEnum._('manual');
const TopupRequestPaymentProviderEnum _$topupRequestPaymentProviderEnum_doku =
    const TopupRequestPaymentProviderEnum._('doku');

TopupRequestPaymentProviderEnum _$topupRequestPaymentProviderEnumValueOf(
    String name) {
  switch (name) {
    case 'manual':
      return _$topupRequestPaymentProviderEnum_manual;
    case 'doku':
      return _$topupRequestPaymentProviderEnum_doku;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<TopupRequestPaymentProviderEnum>
    _$topupRequestPaymentProviderEnumValues = BuiltSet<
        TopupRequestPaymentProviderEnum>(const <TopupRequestPaymentProviderEnum>[
  _$topupRequestPaymentProviderEnum_manual,
  _$topupRequestPaymentProviderEnum_doku,
]);

Serializer<TopupRequestPaymentProviderEnum>
    _$topupRequestPaymentProviderEnumSerializer =
    _$TopupRequestPaymentProviderEnumSerializer();

class _$TopupRequestPaymentProviderEnumSerializer
    implements PrimitiveSerializer<TopupRequestPaymentProviderEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'manual': 'manual',
    'doku': 'doku',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'manual': 'manual',
    'doku': 'doku',
  };

  @override
  final Iterable<Type> types = const <Type>[TopupRequestPaymentProviderEnum];
  @override
  final String wireName = 'TopupRequestPaymentProviderEnum';

  @override
  Object serialize(
          Serializers serializers, TopupRequestPaymentProviderEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TopupRequestPaymentProviderEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TopupRequestPaymentProviderEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

abstract class TopupRequestBuilder {
  void replace(TopupRequest other);
  void update(void Function(TopupRequestBuilder) updates);
  int? get id;
  set id(int? id);

  int? get userId;
  set userId(int? userId);

  int? get amountRupiah;
  set amountRupiah(int? amountRupiah);

  int? get creditsRequested;
  set creditsRequested(int? creditsRequested);

  int? get conversionRateSnapshot;
  set conversionRateSnapshot(int? conversionRateSnapshot);

  String? get paymentReferenceNote;
  set paymentReferenceNote(String? paymentReferenceNote);

  String? get proofObjectPath;
  set proofObjectPath(String? proofObjectPath);

  TopupRequestStatus? get status;
  set status(TopupRequestStatus? status);

  int? get reviewedByUserId;
  set reviewedByUserId(int? reviewedByUserId);

  DateTime? get reviewedAt;
  set reviewedAt(DateTime? reviewedAt);

  String? get reviewNote;
  set reviewNote(String? reviewNote);

  int? get creditsGranted;
  set creditsGranted(int? creditsGranted);

  DateTime? get createdAt;
  set createdAt(DateTime? createdAt);

  TopupRequestPaymentProviderEnum? get paymentProvider;
  set paymentProvider(TopupRequestPaymentProviderEnum? paymentProvider);

  String? get dokuPaymentUrl;
  set dokuPaymentUrl(String? dokuPaymentUrl);
}

class _$$TopupRequest extends $TopupRequest {
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
  @override
  final TopupRequestPaymentProviderEnum paymentProvider;
  @override
  final String dokuPaymentUrl;

  factory _$$TopupRequest([void Function($TopupRequestBuilder)? updates]) =>
      ($TopupRequestBuilder()..update(updates))._build();

  _$$TopupRequest._(
      {required this.id,
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
      required this.createdAt,
      required this.paymentProvider,
      required this.dokuPaymentUrl})
      : super._();
  @override
  $TopupRequest rebuild(void Function($TopupRequestBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  $TopupRequestBuilder toBuilder() => $TopupRequestBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is $TopupRequest &&
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
        createdAt == other.createdAt &&
        paymentProvider == other.paymentProvider &&
        dokuPaymentUrl == other.dokuPaymentUrl;
  }

  @override
  int get hashCode {
    var _$hash = 0;
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
    _$hash = $jc(_$hash, paymentProvider.hashCode);
    _$hash = $jc(_$hash, dokuPaymentUrl.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'$TopupRequest')
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
          ..add('createdAt', createdAt)
          ..add('paymentProvider', paymentProvider)
          ..add('dokuPaymentUrl', dokuPaymentUrl))
        .toString();
  }
}

class $TopupRequestBuilder
    implements
        Builder<$TopupRequest, $TopupRequestBuilder>,
        TopupRequestBuilder {
  _$$TopupRequest? _$v;

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

  TopupRequestPaymentProviderEnum? _paymentProvider;
  TopupRequestPaymentProviderEnum? get paymentProvider =>
      _$this._paymentProvider;
  set paymentProvider(
          covariant TopupRequestPaymentProviderEnum? paymentProvider) =>
      _$this._paymentProvider = paymentProvider;

  String? _dokuPaymentUrl;
  String? get dokuPaymentUrl => _$this._dokuPaymentUrl;
  set dokuPaymentUrl(covariant String? dokuPaymentUrl) =>
      _$this._dokuPaymentUrl = dokuPaymentUrl;

  $TopupRequestBuilder() {
    $TopupRequest._defaults(this);
  }

  $TopupRequestBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
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
      _paymentProvider = $v.paymentProvider;
      _dokuPaymentUrl = $v.dokuPaymentUrl;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(covariant $TopupRequest other) {
    _$v = other as _$$TopupRequest;
  }

  @override
  void update(void Function($TopupRequestBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  $TopupRequest build() => _build();

  _$$TopupRequest _build() {
    final _$result = _$v ??
        _$$TopupRequest._(
          id: BuiltValueNullFieldError.checkNotNull(id, r'$TopupRequest', 'id'),
          userId: BuiltValueNullFieldError.checkNotNull(
              userId, r'$TopupRequest', 'userId'),
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'$TopupRequest', 'amountRupiah'),
          creditsRequested: BuiltValueNullFieldError.checkNotNull(
              creditsRequested, r'$TopupRequest', 'creditsRequested'),
          conversionRateSnapshot: BuiltValueNullFieldError.checkNotNull(
              conversionRateSnapshot,
              r'$TopupRequest',
              'conversionRateSnapshot'),
          paymentReferenceNote: BuiltValueNullFieldError.checkNotNull(
              paymentReferenceNote, r'$TopupRequest', 'paymentReferenceNote'),
          proofObjectPath: BuiltValueNullFieldError.checkNotNull(
              proofObjectPath, r'$TopupRequest', 'proofObjectPath'),
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'$TopupRequest', 'status'),
          reviewedByUserId: BuiltValueNullFieldError.checkNotNull(
              reviewedByUserId, r'$TopupRequest', 'reviewedByUserId'),
          reviewedAt: BuiltValueNullFieldError.checkNotNull(
              reviewedAt, r'$TopupRequest', 'reviewedAt'),
          reviewNote: BuiltValueNullFieldError.checkNotNull(
              reviewNote, r'$TopupRequest', 'reviewNote'),
          creditsGranted: BuiltValueNullFieldError.checkNotNull(
              creditsGranted, r'$TopupRequest', 'creditsGranted'),
          createdAt: BuiltValueNullFieldError.checkNotNull(
              createdAt, r'$TopupRequest', 'createdAt'),
          paymentProvider: BuiltValueNullFieldError.checkNotNull(
              paymentProvider, r'$TopupRequest', 'paymentProvider'),
          dokuPaymentUrl: BuiltValueNullFieldError.checkNotNull(
              dokuPaymentUrl, r'$TopupRequest', 'dokuPaymentUrl'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
