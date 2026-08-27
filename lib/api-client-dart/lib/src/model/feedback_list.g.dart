// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'feedback_list.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$FeedbackList extends FeedbackList {
  @override
  final BuiltList<FeedbackWithDetails> feedback;
  @override
  final int total;
  @override
  final int page;
  @override
  final int limit;

  factory _$FeedbackList([void Function(FeedbackListBuilder)? updates]) =>
      (FeedbackListBuilder()..update(updates))._build();

  _$FeedbackList._(
      {required this.feedback,
      required this.total,
      required this.page,
      required this.limit})
      : super._();
  @override
  FeedbackList rebuild(void Function(FeedbackListBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  FeedbackListBuilder toBuilder() => FeedbackListBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is FeedbackList &&
        feedback == other.feedback &&
        total == other.total &&
        page == other.page &&
        limit == other.limit;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, feedback.hashCode);
    _$hash = $jc(_$hash, total.hashCode);
    _$hash = $jc(_$hash, page.hashCode);
    _$hash = $jc(_$hash, limit.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'FeedbackList')
          ..add('feedback', feedback)
          ..add('total', total)
          ..add('page', page)
          ..add('limit', limit))
        .toString();
  }
}

class FeedbackListBuilder
    implements Builder<FeedbackList, FeedbackListBuilder> {
  _$FeedbackList? _$v;

  ListBuilder<FeedbackWithDetails>? _feedback;
  ListBuilder<FeedbackWithDetails> get feedback =>
      _$this._feedback ??= ListBuilder<FeedbackWithDetails>();
  set feedback(ListBuilder<FeedbackWithDetails>? feedback) =>
      _$this._feedback = feedback;

  int? _total;
  int? get total => _$this._total;
  set total(int? total) => _$this._total = total;

  int? _page;
  int? get page => _$this._page;
  set page(int? page) => _$this._page = page;

  int? _limit;
  int? get limit => _$this._limit;
  set limit(int? limit) => _$this._limit = limit;

  FeedbackListBuilder() {
    FeedbackList._defaults(this);
  }

  FeedbackListBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _feedback = $v.feedback.toBuilder();
      _total = $v.total;
      _page = $v.page;
      _limit = $v.limit;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(FeedbackList other) {
    _$v = other as _$FeedbackList;
  }

  @override
  void update(void Function(FeedbackListBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  FeedbackList build() => _build();

  _$FeedbackList _build() {
    _$FeedbackList _$result;
    try {
      _$result = _$v ??
          _$FeedbackList._(
            feedback: feedback.build(),
            total: BuiltValueNullFieldError.checkNotNull(
                total, r'FeedbackList', 'total'),
            page: BuiltValueNullFieldError.checkNotNull(
                page, r'FeedbackList', 'page'),
            limit: BuiltValueNullFieldError.checkNotNull(
                limit, r'FeedbackList', 'limit'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'feedback';
        feedback.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'FeedbackList', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
