// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_topup_request_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const ReviewTopupRequestBodyStatusEnum
    _$reviewTopupRequestBodyStatusEnum_approved =
    const ReviewTopupRequestBodyStatusEnum._('approved');
const ReviewTopupRequestBodyStatusEnum
    _$reviewTopupRequestBodyStatusEnum_rejected =
    const ReviewTopupRequestBodyStatusEnum._('rejected');

ReviewTopupRequestBodyStatusEnum _$reviewTopupRequestBodyStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'approved':
      return _$reviewTopupRequestBodyStatusEnum_approved;
    case 'rejected':
      return _$reviewTopupRequestBodyStatusEnum_rejected;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<ReviewTopupRequestBodyStatusEnum>
    _$reviewTopupRequestBodyStatusEnumValues = BuiltSet<
        ReviewTopupRequestBodyStatusEnum>(const <ReviewTopupRequestBodyStatusEnum>[
  _$reviewTopupRequestBodyStatusEnum_approved,
  _$reviewTopupRequestBodyStatusEnum_rejected,
]);

Serializer<ReviewTopupRequestBodyStatusEnum>
    _$reviewTopupRequestBodyStatusEnumSerializer =
    _$ReviewTopupRequestBodyStatusEnumSerializer();

class _$ReviewTopupRequestBodyStatusEnumSerializer
    implements PrimitiveSerializer<ReviewTopupRequestBodyStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'approved': 'approved',
    'rejected': 'rejected',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'approved': 'approved',
    'rejected': 'rejected',
  };

  @override
  final Iterable<Type> types = const <Type>[ReviewTopupRequestBodyStatusEnum];
  @override
  final String wireName = 'ReviewTopupRequestBodyStatusEnum';

  @override
  Object serialize(
          Serializers serializers, ReviewTopupRequestBodyStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  ReviewTopupRequestBodyStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      ReviewTopupRequestBodyStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$ReviewTopupRequestBody extends ReviewTopupRequestBody {
  @override
  final ReviewTopupRequestBodyStatusEnum status;
  @override
  final int? creditsGranted;
  @override
  final String? reviewNote;

  factory _$ReviewTopupRequestBody(
          [void Function(ReviewTopupRequestBodyBuilder)? updates]) =>
      (ReviewTopupRequestBodyBuilder()..update(updates))._build();

  _$ReviewTopupRequestBody._(
      {required this.status, this.creditsGranted, this.reviewNote})
      : super._();
  @override
  ReviewTopupRequestBody rebuild(
          void Function(ReviewTopupRequestBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  ReviewTopupRequestBodyBuilder toBuilder() =>
      ReviewTopupRequestBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is ReviewTopupRequestBody &&
        status == other.status &&
        creditsGranted == other.creditsGranted &&
        reviewNote == other.reviewNote;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, status.hashCode);
    _$hash = $jc(_$hash, creditsGranted.hashCode);
    _$hash = $jc(_$hash, reviewNote.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'ReviewTopupRequestBody')
          ..add('status', status)
          ..add('creditsGranted', creditsGranted)
          ..add('reviewNote', reviewNote))
        .toString();
  }
}

class ReviewTopupRequestBodyBuilder
    implements Builder<ReviewTopupRequestBody, ReviewTopupRequestBodyBuilder> {
  _$ReviewTopupRequestBody? _$v;

  ReviewTopupRequestBodyStatusEnum? _status;
  ReviewTopupRequestBodyStatusEnum? get status => _$this._status;
  set status(ReviewTopupRequestBodyStatusEnum? status) =>
      _$this._status = status;

  int? _creditsGranted;
  int? get creditsGranted => _$this._creditsGranted;
  set creditsGranted(int? creditsGranted) =>
      _$this._creditsGranted = creditsGranted;

  String? _reviewNote;
  String? get reviewNote => _$this._reviewNote;
  set reviewNote(String? reviewNote) => _$this._reviewNote = reviewNote;

  ReviewTopupRequestBodyBuilder() {
    ReviewTopupRequestBody._defaults(this);
  }

  ReviewTopupRequestBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _status = $v.status;
      _creditsGranted = $v.creditsGranted;
      _reviewNote = $v.reviewNote;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(ReviewTopupRequestBody other) {
    _$v = other as _$ReviewTopupRequestBody;
  }

  @override
  void update(void Function(ReviewTopupRequestBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  ReviewTopupRequestBody build() => _build();

  _$ReviewTopupRequestBody _build() {
    final _$result = _$v ??
        _$ReviewTopupRequestBody._(
          status: BuiltValueNullFieldError.checkNotNull(
              status, r'ReviewTopupRequestBody', 'status'),
          creditsGranted: creditsGranted,
          reviewNote: reviewNote,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
