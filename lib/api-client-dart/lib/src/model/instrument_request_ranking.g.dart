// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instrument_request_ranking.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$InstrumentRequestRanking extends InstrumentRequestRanking {
  @override
  final BuiltList<InstrumentRequestRank> requests;

  factory _$InstrumentRequestRanking(
          [void Function(InstrumentRequestRankingBuilder)? updates]) =>
      (InstrumentRequestRankingBuilder()..update(updates))._build();

  _$InstrumentRequestRanking._({required this.requests}) : super._();
  @override
  InstrumentRequestRanking rebuild(
          void Function(InstrumentRequestRankingBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  InstrumentRequestRankingBuilder toBuilder() =>
      InstrumentRequestRankingBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is InstrumentRequestRanking && requests == other.requests;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, requests.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'InstrumentRequestRanking')
          ..add('requests', requests))
        .toString();
  }
}

class InstrumentRequestRankingBuilder
    implements
        Builder<InstrumentRequestRanking, InstrumentRequestRankingBuilder> {
  _$InstrumentRequestRanking? _$v;

  ListBuilder<InstrumentRequestRank>? _requests;
  ListBuilder<InstrumentRequestRank> get requests =>
      _$this._requests ??= ListBuilder<InstrumentRequestRank>();
  set requests(ListBuilder<InstrumentRequestRank>? requests) =>
      _$this._requests = requests;

  InstrumentRequestRankingBuilder() {
    InstrumentRequestRanking._defaults(this);
  }

  InstrumentRequestRankingBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _requests = $v.requests.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(InstrumentRequestRanking other) {
    _$v = other as _$InstrumentRequestRanking;
  }

  @override
  void update(void Function(InstrumentRequestRankingBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  InstrumentRequestRanking build() => _build();

  _$InstrumentRequestRanking _build() {
    _$InstrumentRequestRanking _$result;
    try {
      _$result = _$v ??
          _$InstrumentRequestRanking._(
            requests: requests.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'requests';
        requests.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'InstrumentRequestRanking', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
